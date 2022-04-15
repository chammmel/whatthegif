use protobuf::well_known_types::Any;
use log::log;

use crate::generated::communication::{JoinRequest, Message, PreJoinRequest, CreateRoomRequest};

#[derive(Debug)]
pub enum DataResult {
    JoinRequest(JoinRequest),
    PreJoinRequest(PreJoinRequest),
    CreateRoomRequest(CreateRoomRequest),
}

fn get_message(bytes: Vec<u8>) -> Option<Message> {
    match ::protobuf::Message::parse_from_bytes(&bytes) {
        Ok(data) => Some(data),
        Err(_) => {
            log::debug!("Unable to decode Message, {bytes:?}");
            None
        }
    }
}

pub fn data_writer(bytes: Vec<u8>, local_str: &str, local_origin: &str) -> Vec<u8> {
    let mut message: Message = Message::new();
    message.set_origin(local_origin.to_string());
    let mut any = Any::new();
    any.set_type_url(local_str.to_string());
    any.set_value(bytes);
    message.set_payload(any);
    ::protobuf::Message::write_to_bytes(&message).unwrap()
}

pub fn data_parser(bytes: Vec<u8>, local_origin: &str) -> Result<DataResult, &'static str> {
    let message = get_message(bytes);

    match message {
        Some(message) => {
            if message.get_origin() == local_origin {
                return Err("Same origin");
            }

            let payload: ::protobuf::well_known_types::Any = message.payload.unwrap();

            match payload.type_url.as_str() {
                "PreJoinRequest" => {
                    let out: PreJoinRequest =
                        ::protobuf::Message::parse_from_bytes(&payload.value).unwrap();
                    Ok(DataResult::PreJoinRequest(out))
                }
                "JoinRequest" => {
                    let out: JoinRequest =
                        ::protobuf::Message::parse_from_bytes(&payload.value).unwrap();
                    Ok(DataResult::JoinRequest(out))
                }
                "CreateRoomRequest" => {
                    let out: CreateRoomRequest =
                        ::protobuf::Message::parse_from_bytes(&payload.value).unwrap();
                    Ok(DataResult::CreateRoomRequest(out))
                }
                _ => Err("Unknown data"),
            }
        }
        None => Err("Unable to decode message"),
    }
}
