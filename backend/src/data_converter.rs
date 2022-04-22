use protobuf::well_known_types::Any;

use crate::generated::communication::{JoinRequest, Message, PreJoinRequest, CreateRoomRequest, RoomInfoRequest};

#[derive(Debug)]
pub enum DataResultRequest {
    Join(JoinRequest),
    PreJoin(PreJoinRequest),
    CreateRoom(CreateRoomRequest),
    RoomInfo(RoomInfoRequest)
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

pub fn data_parser(bytes: Vec<u8>, local_origin: &str) -> Result<DataResultRequest, &'static str> {
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
                    Ok(DataResultRequest::PreJoin(out))
                }
                "JoinRequest" => {
                    let out: JoinRequest =
                        ::protobuf::Message::parse_from_bytes(&payload.value).unwrap();
                    Ok(DataResultRequest::Join(out))
                }
                "CreateRoomRequest" => {
                    let out: CreateRoomRequest =
                        ::protobuf::Message::parse_from_bytes(&payload.value).unwrap();
                    Ok(DataResultRequest::CreateRoom(out))
                }
                "RoomInfoRequest" => {
                    let out: RoomInfoRequest =
                        ::protobuf::Message::parse_from_bytes(&payload.value).unwrap();
                    Ok(DataResultRequest::RoomInfo(out))
                }
                _ => Err("Unknown datatype: It has to be registered"),
            }
        }
        None => Err("Unable to decode message"),
    }
}
