use std::{collections::HashMap, convert::Infallible, sync::Arc};

use random_string::generate;

use futures::SinkExt;
use futures::StreamExt;

use serde::Deserialize;
use serde::Serialize;
use serde_json::json;
use tokio::sync::mpsc::UnboundedReceiver;
use tokio::sync::{
    mpsc::{self, UnboundedSender},
    Mutex,
};
use uuid::Uuid;
use warp::hyper::StatusCode;
use warp::{
    ws::{Message, WebSocket},
    Filter, Rejection, Reply,
};

use crate::{
    configuration::Args,
    data_converter::{self, DataResult},
    data_store::{DataStore, Room, Store},
    generated::communication::CreateRoomResponse,
    handler::join,
};

#[derive(Deserialize, Debug)]
pub struct RegisterRequest {
    user_id: usize,
}

#[derive(Serialize, Debug)]
pub struct RegisterResponse {
    url: String,
}

#[derive(Clone)]
pub struct Client {
    pub user_id: usize,
    pub topics: Vec<String>,
    pub sender: Option<mpsc::UnboundedSender<Message>>,
}

type Result<T> = std::result::Result<T, Rejection>;
type Clients = Arc<Mutex<HashMap<String, Client>>>;

type Org = String;

pub async fn register_handler(body: RegisterRequest, clients: Clients) -> Result<impl Reply> {
    let user_id = body.user_id;
    let uuid = Uuid::new_v4().simple().to_string();

    register_client(uuid.clone(), user_id, clients).await;
    Ok(warp::reply::json(&RegisterResponse {
        url: format!("ws://127.0.0.1/api/ws/{}", uuid),
    }))
}

async fn register_client(id: String, user_id: usize, clients: Clients) {
    clients.lock().await.insert(
        id,
        Client {
            user_id,
            topics: vec![String::from("cats")],
            sender: None,
        },
    );
}

pub async fn unregister_handler(id: String, clients: Clients) -> Result<impl Reply> {
    clients.lock().await.remove(&id);
    Ok(StatusCode::OK)
}

pub async fn client_connection(
    ws: WebSocket,
    id: String,
    clients: Clients,
    mut client: Client,
    data_store: DataStore,
    org: Org,
) {
    let (mut client_ws_sender, mut client_ws_rcv) = ws.split();
    let (client_sender, mut client_rcv): (UnboundedSender<Message>, UnboundedReceiver<Message>) =
        mpsc::unbounded_channel();

    tokio::task::spawn(async move {
        while let Some(c) = &client_rcv.recv().await {
            //client_ws_sender.reunite
            match client_ws_sender.send(c.to_owned()).await {
                Ok(_) => {}
                Err(_) => log::error!("Unable to send message to client"),
            }
        }
    });

    client.sender = Some(client_sender);
    clients.lock().await.insert(id.clone(), client);
    log::info!("The client {id} connected");

    while let Some(result) = client_ws_rcv.next().await {
        let msg = match result {
            Ok(msg) => msg,
            Err(e) => {
                log::error!("error receiving ws message for id: {}): {}", id.clone(), e);
                break;
            }
        };
        client_msg(&id, msg, &clients, &data_store, &org).await;
    }

    clients.lock().await.remove(&id);
    log::info!("The client: {id} disconnected");
}

pub async fn ws_handler(
    ws: warp::ws::Ws,
    id: String,
    clients: Clients,
    data_store: DataStore,
    org: Org,
) -> Result<impl Reply> {
    let client = clients.lock().await.get(&id).cloned();
    match client {
        Some(c) => {
            Ok(ws.on_upgrade(move |socket| {
                client_connection(socket, id, clients, c, data_store, org)
            }))
        }
        None => {
            log::info!("Client does not exist");

            Err(warp::reject::not_found())
        }
    }
}

fn with_clients(clients: Clients) -> impl Filter<Extract = (Clients,), Error = Infallible> + Clone {
    warp::any().map(move || clients.clone())
}

fn with_org(org: Org) -> impl Filter<Extract = (Org,), Error = Infallible> + Clone {
    warp::any().map(move || org.clone())
}

fn with_data_store(
    data_store: DataStore,
) -> impl Filter<Extract = (DataStore,), Error = Infallible> + Clone {
    warp::any().map(move || data_store.clone())
}

pub async fn start(args: &Args, data_store: &Arc<Mutex<Store>>) {
    let clients: Clients = Arc::new(Mutex::new(HashMap::new()));
    let org = args.get_origin().unwrap_or_default();

    let register = warp::path("register");
    let register_routes = register
        .and(warp::post())
        .and(warp::body::json())
        .and(with_clients(clients.clone()))
        .and_then(register_handler)
        .or(register
            .and(warp::delete())
            .and(warp::path::param())
            .and(with_clients(clients.clone()))
            .and_then(unregister_handler));

    let ws_route = warp::path("ws")
        .and(warp::ws())
        .and(warp::path::param())
        .and(with_clients(clients.clone()))
        .and(with_data_store(data_store.clone()))
        .and(with_org(org.clone()))
        .and_then(ws_handler);

    let routes = register_routes
        .or(ws_route);

    let api_routes = warp::path("api").and(routes).with(warp::cors().allow_any_origin());

    log::info!("Webserver will start");
    warp::serve(api_routes).run(([127, 0, 0, 1], 8080)).await;
}

async fn client_msg(id: &str, msg: Message, clients: &Clients, store: &DataStore, org: &Org) {
    match data_converter::data_parser(msg.into_bytes(), org.as_str()) {
        Ok(data) => {
            let result = data_event_handler(data, &id, store, org.as_str()).await;

            match result {
                Some(result) => {
                    let result = Message::binary(result);

                    if let Some(client) = clients.lock().await.get_mut(id) {
                        match client.sender.as_ref().unwrap().send(result) {
                            Ok(_) => {}
                            Err(_) => log::error!("Unable to send message"),
                        }
                    }
                }
                None => {
                    log::error!("No aswer for clinet: {id}");
                }
            }
        }
        Err(_) => {
            log::error!("Unexpected data reseved from client: {id}");
        }
    }
}

async fn data_event_handler(
    data_result: DataResult,
    device_id: &str,
    store: &DataStore,
    origin: &str,
) -> Option<Vec<u8>> {
    log::debug!("{data_result:?}, device_id: {device_id}, origin: {origin}");
    let mut result = None;
    match data_result {
        DataResult::JoinRequest(data) => {
            result = join::join_request(data, &device_id, &store, &origin).await
        }
        DataResult::PreJoinRequest(data) => {
            result = join::pre_join_request(data, &device_id, &store, &origin).await
        }
        DataResult::CreateRoomRequest(data) => {
            log::debug!("{device_id}: {data:?}");

            let code = generate(6, "ABCDEFGHIJKLMNPRSTUVWXYZ123456789");
            let mut store = store.lock().await;
            store.rooms.insert(
                code.clone(),
                Room {
                    size: data.get_players(),
                    max_size: i32::MAX,
                    status: crate::data_store::RoomState::LOBBY,
                    rounds: data.get_rounds(),
                    users: vec![],
                    keywords: vec![],
                    password: None, //password: data.get_password(),
                },
            );

            let mut response = CreateRoomResponse::new();
            response.set_code(code);
            response.set_errors(crate::generated::communication::CreateRoomError::DONE);

            result = Some(data_converter::data_writer(
                protobuf::Message::write_to_bytes(&response).unwrap(),
                "CreateRoomResponse",
                &origin,
            ));
        }
        _ => log::info!("Unknown data in data_event_handler"),
    };

    result
}
