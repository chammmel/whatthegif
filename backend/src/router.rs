use std::{
    net::TcpListener,
    sync::{Arc, Mutex},
};

use log::log;
use random_string::generate;

use tungstenite::{
    accept_hdr,
    handshake::server::{Request, Response, ErrorResponse},
};

use crate::{
    configuration::Args,
    data_converter::{self, DataResult},
    data_store::{Room, Store},
    generated::communication::CreateRoomResponse,
    handler::join,
};

pub fn start(args: &Args, data_store: &Arc<Mutex<Store>>) {
    let ip = "127.0.0.1:8080";
    let server = TcpListener::bind(&ip).unwrap();

    let origin: Arc<String> = Arc::new(args.get_origin().unwrap());

    log::debug!("Started Websocket at {}", &ip);
    for stream in server.incoming() {
        let org = Arc::clone(&origin);
        let store = Arc::clone(&data_store);
        tokio::spawn(async move {
            let pathg = "asd";
            let callback = |req: &Request, response: Response| {
                let path = req.uri().path();
                log::debug!("the request's path is: {path}");
                //pathg = path;
                Ok(response)
            };


            let mut websocket = accept_hdr(stream.unwrap(), callback).unwrap();

            loop {
                if let Ok(msg) = websocket.read_message() {
                    if msg.is_binary() {
                        match data_converter::data_parser(msg.into_data(), org.as_str()) {
                            Ok(data) => {
                                let result =
                                    data_event_handler(data, pathg, &store, org.as_str()).unwrap();
                                websocket
                                    .write_message(tungstenite::Message::Binary(result))
                                    .unwrap();
                            }
                            Err(_) => todo!(),
                        }
                    }
                }
            }
        });
    }
}

fn data_event_handler(
    data_result: DataResult,
    device_id: &str,
    store: &Arc<Mutex<Store>>,
    origin: &str,
) -> Option<Vec<u8>> {
    log::debug!("{data_result:?}, device_id: {device_id}, origin: {origin}");
    let mut result = None;
    match data_result {
        DataResult::JoinRequest(data) => {
            result = join::join_request(data, &device_id, &store, &origin)
        }
        DataResult::PreJoinRequest(data) => {
            result = join::pre_join_request(data, &device_id, &store, &origin)
        }
        DataResult::CreateRoomRequest(data) => {
            log::debug!("{device_id}: {data:?}");

            let code = generate(6, "ABCDEFGHIJKLMNPRSTUVWXYZ123456789");
            if let Ok(mut x) = store.lock() {
                x.rooms.insert(
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
            }

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
