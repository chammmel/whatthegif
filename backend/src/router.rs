use warp::ws::Message;

use crate::data_store::Users;
use crate::handler::room;
use crate::{
    data_converter::{self, DataResultRequest},
    data_store::DataStore,
    handler::join,
};

type Org = String;

pub async fn data_event_handler(
    data_result: DataResultRequest,
    device_id: &str,
    store: &DataStore,
    users: &Users,
    origin: &str,
) -> Option<Vec<u8>> {
    log::debug!("{data_result:?}, device_id: {device_id}, origin: {origin}");
    match data_result {
        DataResultRequest::Join(data) => join::join_request(data, device_id, store, origin).await,
        DataResultRequest::PreJoin(data) => {
            join::pre_join_request(data, device_id, store, origin).await
        }
        DataResultRequest::RoomInfo(data) => room::room_info_request(data, store, origin).await,
        DataResultRequest::CreateRoom(data) => room::create_room_request(data, store, origin).await,
    }
}

pub async fn client_msg(id: &str, msg: Message, users: &Users, store: &DataStore, org: &Org) {
    match data_converter::data_parser(msg.into_bytes(), org.as_str()) {
        Ok(data) => {
            let result = data_event_handler(data, id, store, users, org.as_str()).await;

            match result {
                Some(result) => {
                    let result = Message::binary(result);

                    if let Some(client) = users.lock().await.get_mut(id) {
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
        Err(e) => {
            log::error!("Unexpected data reseved from client: {id}, error: {e}");
        }
    }
}
