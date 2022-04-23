use std::{collections::HashMap, convert::Infallible, sync::Arc};


use futures::SinkExt;
use futures::StreamExt;

use futures::TryFutureExt;
use serde::Deserialize;
use serde::Serialize;
use tokio::sync::mpsc::UnboundedReceiver;
use tokio::sync::{
    mpsc::{self, UnboundedSender},
    Mutex,
};
use tokio_stream::wrappers::UnboundedReceiverStream;
use uuid::Uuid;
use warp::hyper::StatusCode;
use warp::{
    ws::{Message, WebSocket},
    Filter, Rejection, Reply,
};

use crate::data_store::User;
use crate::data_store::Users;
use crate::router;
use crate::{
    configuration::Args,
    data_store::{DataStore, Store},
};

#[derive(Deserialize, Debug)]
pub struct RegisterRequest {
    user_id: usize,
}

#[derive(Serialize, Debug)]
pub struct RegisterResponse {
    url: String,
}

type Result<T> = std::result::Result<T, Rejection>;

type Org = String;

pub async fn client_connection(
    ws: WebSocket,
    id: String,
    users: Users,
    mut user: User,
    data_store: DataStore,
    org: Org,
) {
    let (mut user_ws_tx, mut user_ws_rx) = ws.split();
    let (client_tx, client_rx): (UnboundedSender<Message>, UnboundedReceiver<Message>) =
        mpsc::unbounded_channel();
    let mut client_rx = UnboundedReceiverStream::new(client_rx);

    tokio::task::spawn(async move {
        while let Some(c) = client_rx.next().await {
            //client_ws_sender.reunite
            user_ws_tx
                .send(c.to_owned())
                .unwrap_or_else(|e| {
                    log::error!("Unable to send message to client error: {e}");
                })
                .await
        }
    });

    user.sender = Some(client_tx);
    users.lock().await.insert(id.clone(), user);
    log::info!("The client {id} connected");

    while let Some(result) = user_ws_rx.next().await {
        let msg = match result {
            Ok(msg) => msg,
            Err(e) => {
                log::error!("error receiving ws message for id: {id}): {e}");
                break;
            }
        };
        router::client_msg(&id, msg, &users, &data_store, &org).await;
    }

    users.lock().await.remove(&id);
    log::info!("The client: {id} disconnected");
}

pub async fn ws_handler(
    ws: warp::ws::Ws,
    id: String,
    clients: Users,
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

fn with_clients(users: Users) -> impl Filter<Extract = (Users,), Error = Infallible> + Clone {
    warp::any().map(move || users.clone())
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
    let users: Users = Arc::new(Mutex::new(HashMap::new()));
    let org = args.get_origin().unwrap_or_default();

    let register = warp::path("register");
    let register_routes = register
        .and(warp::post())
        .and(warp::body::json())
        .and(with_clients(users.clone()))
        .and_then(register_handler)
        .or(register
            .and(warp::delete())
            .and(warp::path::param())
            .and(with_clients(users.clone()))
            .and_then(unregister_handler));

    let ws_route = warp::path("ws")
        .and(warp::ws())
        .and(warp::path::param())
        .and(with_clients(users.clone()))
        .and(with_data_store(data_store.clone()))
        .and(with_org(org.clone()))
        .and_then(ws_handler);

    let routes = register_routes.or(ws_route);

    let api_routes = warp::path("api")
        .and(routes)
        .with(warp::cors().allow_any_origin());

    log::info!("Webserver will start");
    warp::serve(api_routes).run(([127, 0, 0, 1], 8080)).await;
}

// ----------------------------------------------------------------------------
// | Register
// ----------------------------------------------------------------------------
pub async fn register_handler(body: RegisterRequest, clients: Users) -> Result<impl Reply> {
    let user_id = body.user_id;
    let uuid = Uuid::new_v4().simple().to_string();

    register_client(uuid.clone(), user_id, clients).await;
    Ok(warp::reply::json(&RegisterResponse {
        url: format!("ws://127.0.0.1/api/ws/{}", uuid),
    }))
}

async fn register_client(id: String, user_id: usize, clients: Users) {
    clients.lock().await.insert(
        id,
        User {
            user_id: user_id.to_string(),
            room: None,
            name: None,
            image_url: None,
            sender: None,
        },
    );
}

pub async fn unregister_handler(id: String, clients: Users) -> Result<impl Reply> {
    clients.lock().await.remove(&id);
    Ok(StatusCode::OK)
}
