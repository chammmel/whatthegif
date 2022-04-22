use protobuf::RepeatedField;

use crate::{
    data_converter,
    data_store::DataStore,
    generated::{
        self,
        communication::{JoinError, JoinRequest, JoinResponse, PreJoinRequest, PreJoinResponse},
    },
};

pub async fn pre_join_request(
    data: PreJoinRequest,
    device_id: &str,
    store: &DataStore,
    origin: &str,
) -> Option<Vec<u8>> {
    log::debug!("{device_id}: {data:?}");

    let mut reponse = PreJoinResponse::new();
    let store = store.lock().await;

    let room_id = &data.get_room();
    let room = store.get_room(room_id);
    match &room {
        Some(room) => {
            let mut join_error = JoinError::FINE;
            if room.is_full() {
                log::info!("Room: {room:?} is full");
                join_error = JoinError::ROOM_FULL;
            }
            if room.has_password() {
                log::info!("Room: {room:?} requires password");
                join_error = JoinError::REQUIRES_PASSWORD;
            }

            reponse.set_code(room_id.to_string());
            reponse.set_error(join_error);
        }
        None => {
            log::info!("Unable to find room: {room_id}");
            reponse.set_error(JoinError::NOT_FOUND);
        }
    };

    Some(data_converter::data_writer(
        ::protobuf::Message::write_to_bytes(&reponse).unwrap(),
        "PreJoinResponse",
        origin,
    ))
}
pub async fn join_request(
    data: JoinRequest,
    device_id: &str,
    store: &DataStore,
    origin: &str,
) -> Option<Vec<u8>> {
    log::debug!("{device_id}: {data:?}");

    let mut response = JoinResponse::new();

    let store = store.lock().await;

    let room = store.get_room(data.get_room());
    match room {
        Some(room) => {
            if room.is_full() {
                response.set_error(JoinError::ROOM_FULL);
            } else if room.has_password() {
                if !data.has_password() {
                    response.set_error(JoinError::REQUIRES_PASSWORD);
                } else if data.get_password() == room.password.as_ref().unwrap() {
                    response.set_error(JoinError::FINE);

                    //TODO: set content
                }
            } else {
                response.set_error(JoinError::FINE);
            }

            if response.get_error() == JoinError::FINE {
                let users = room
                    .users
                    .clone()
                    .iter()
                    .map(|u| {
                        let u = u.to_owned();
                        let mut user = generated::communication::User::new();
                        user.set_uuid(u.user_id.to_string());
                        user.set_name(u.name.unwrap_or_default());
                        user.set_image_url(u.image_url.unwrap_or_else(|| {
                            String::from("https://i.giphy.com/media/gvnBUe6e3ZRxC/giphy.webp")
                        }));

                        user
                    })
                    .collect();
                response.set_user(RepeatedField::from_vec(users))
            }
        }
        None => {
            response.set_error(JoinError::NOT_FOUND);
        }
    }

    Some(data_converter::data_writer(
        ::protobuf::Message::write_to_bytes(&response).unwrap(),
        "JoinResponse",
        origin,
    ))
}
