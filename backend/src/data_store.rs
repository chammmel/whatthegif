use std::{collections::HashMap, sync::Arc};

use tokio::sync::{mpsc, Mutex};
use warp::ws::Message;

pub type DataStore = Arc<Mutex<Store>>;

pub struct Store {
    pub rooms: HashMap<String, Room>,
}

impl Store {
    pub fn get_room(&mut self, id: &str) -> Option<&mut Room> {
        self.rooms.get_mut(id)
    }
}

#[derive(Debug)]
pub struct Room {
    pub code: String,
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
    Lobby,
    Running,
}

impl Room {
    pub fn new(code: String, size: i32, rounds: i32, password: Option<String>) -> Self {
        Self {
            code,
            size: 0,
            max_size: size,
            status: crate::data_store::RoomState::Lobby,
            rounds,
            users: vec![],
            keywords: vec![],
            password,
        }
    }

    pub fn has_password(&self) -> bool {
        self.password.is_some()
    }

    pub fn is_full(&self) -> bool {
        self.size >= self.max_size
    }

    pub fn is_running(&self) -> bool {
        self.status == RoomState::Running
    }
}

pub type Users = Arc<Mutex<HashMap<String, User>>>;

#[derive(Debug, Clone)]
pub struct User {
    pub user_id: String,
    pub room: Option<String>,
    pub name: Option<String>,
    pub image_url: Option<String>,
    pub sender: Option<mpsc::UnboundedSender<Message>>,
}
