use protobuf::RepeatedField;
use random_string::generate;

use crate::{
    data_converter,
    data_store::{DataStore, Room},
    generated::communication::{
        CreateRoomRequest, CreateRoomResponse, RoomInfoRequest, RoomInfoResponse,
    },
};

pub async fn create_room_request(
    data: CreateRoomRequest,
    store: &DataStore,
    origin: &str,
) -> Option<Vec<u8>> {
    let password = match data.get_password().is_empty() {
        true => None,
        false => Some(String::from(data.get_password())),
    };

    let code = generate(6, "ABCDEFGHIJKLMNPRSTUVWXYZ123456789");
    let room = Room::new(
        code.clone(),
        data.get_players(),
        data.get_rounds(),
        password,
    );

    let mut store = store.lock().await;
    store.rooms.insert(code.clone(), room);

    let mut response = CreateRoomResponse::new();
    response.set_code(code);
    response.set_error(crate::generated::communication::CreateRoomError::DONE);

    Some(data_converter::data_writer(
        protobuf::Message::write_to_bytes(&response).unwrap(),
        "CreateRoomResponse",
        origin,
    ))
}

pub async fn room_info_request(
    data: RoomInfoRequest,
    store: &DataStore,
    origin: &str,
) -> Option<Vec<u8>> {
    let mut store = store.lock().await;
    let room = store.get_room(data.get_code());
    let mut response = RoomInfoResponse::new();

    if let Some(room) = room {
        response.set_code(String::from(data.get_code()));
        response.set_player_count(room.size);
        response.set_players(room.max_size);
        response.set_rounds(room.rounds);
        response.set_keywords(RepeatedField::from_vec(vec![String::from("rust")]));
        response.set_error(crate::generated::communication::RoomInfoError::OK);
    } else {
        response.set_error(crate::generated::communication::RoomInfoError::ROOM_NOT_FOUND);
    }

    Some(data_converter::data_writer(
        protobuf::Message::write_to_bytes(&response).unwrap(),
        "RoomInfoResponse",
        origin,
    ))
}
