use std::sync::{Arc, Mutex};

use crate::{
    data_converter::{self, DataResult},
    data_store::Store,
    generated::communication::{
        JoinError, JoinRequest, JoinResponse, PreJoinRequest, PreJoinResponse,
    },
};

pub fn pre_join_request(
    data: PreJoinRequest,
    user: &str,
    store: &Arc<Mutex<Store>>,
    origin: &str,
) -> Option<Vec<u8>> {
    println!("{}: {:?}", user, data);

    let mut reponse = PreJoinResponse::new();

    if let Ok(x) = store.lock() {
        let room = x.get_room(data.get_room());
        match room {
            Some(room) => {
                let mut join_error = JoinError::FINE;
                if room.is_full() {
                    join_error = JoinError::ROOM_FULL;
                }
                if room.has_password() {
                    join_error = JoinError::REQUIRES_PASSWORD;
                }

                reponse.set_error(join_error);
            }
            None => {
                reponse.set_error(JoinError::NOT_FOUND);
            }
        };
    }

    Some(data_converter::data_writer(
        ::protobuf::Message::write_to_bytes(&reponse).unwrap(),
        "PreJoinResponse",
        &origin,
    ))
}
pub fn join_request(
    data: JoinRequest,
    user: &str,
    store: &Arc<Mutex<Store>>,
    origin: &str,
) -> Option<Vec<u8>> {
    println!("{}: {:?}", user, data);

    let mut reponse = JoinResponse::new();

    if let Ok(x) = store.lock() {
        let room = x.get_room(data.get_room());
        match room {
            Some(room) => {
                let mut join_error = JoinError::FINE;
                if room.is_full() {
                    join_error = JoinError::ROOM_FULL;
                } else {
                    if room.has_password() {
                        if !data.has_password() {
                            reponse.set_error(JoinError::REQUIRES_PASSWORD);
                        } else {
                            if data.get_password() == room.password.as_ref().unwrap() {
                                reponse.set_error(JoinError::FINE);

                                //TODO: set content
                            }
                        }
                    }
                }

                reponse.set_error(join_error);
            }
            None => {
                reponse.set_error(JoinError::NOT_FOUND);
            }
        };
    }

    Some(data_converter::data_writer(
        ::protobuf::Message::write_to_bytes(&reponse).unwrap(),
        "JoinResponse",
        &origin,
    ))
}
