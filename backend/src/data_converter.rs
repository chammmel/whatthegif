use crate::generated::communication::{Message, PreJoinRequest, JoinRequest};

pub fn get_message(bytes: Vec<u8>) -> Message {
    let message: Message = ::protobuf::Message::parse_from_bytes(&bytes).unwrap();

    message
}

pub fn data_parser(message: Message) {
    let payload: ::protobuf::well_known_types::Any = message.payload.unwrap();


    match payload.type_url.as_str() {
        "PreJoinRequest" => {
            let out: PreJoinRequest = ::protobuf::Message::parse_from_bytes(&payload.value).unwrap();

            println!("{:?}", out);
        },
        "JoinRequest" => {
            let out: JoinRequest = ::protobuf::Message::parse_from_bytes(&payload.value).unwrap();

            println!("{:?}", out);
        }
        _ => println!("Unknown messagetype, {}", payload.type_url)
    }
}

