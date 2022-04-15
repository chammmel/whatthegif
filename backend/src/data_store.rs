use std::{collections::HashMap, sync::{Arc}};

use tokio::sync::Mutex;


pub type DataStore = Arc<Mutex<Store>>;

pub struct Store {
    pub rooms: HashMap<String, Room>,
}

impl Store {
    pub fn get_room(&self, id: &str) -> Option<&Room> {
        self.rooms.get(id)
    }
}

#[derive(Debug)]
pub struct Room {
    pub status: RoomState,
    pub size: i32,
    pub max_size: i32,
    pub rounds: i32,
    pub password: Option<String>,
    pub users: Vec<User>,
    pub keywords: Vec<String>,
}

#[derive(Debug, PartialEq, Eq)]
pub enum RoomState {
    LOBBY,
    RUNNING,
}

impl Room {
    pub fn has_password(&self) -> bool {
        self.password.is_some()
    }

    pub fn is_full(&self) -> bool {
        self.size >= self.max_size
    }

    pub fn is_running(&self) -> bool {
        self.status == RoomState::RUNNING
    }
}

#[derive(Debug)]
pub struct User {
    id: String,
    name: Option<String>,
    image_url: Option<String>
}
