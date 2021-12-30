use std::collections::HashMap;

pub struct Store {
  pub(crate) rooms: HashMap<String, Room>
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
  pub users: Vec<User>
}

#[derive(Debug)]
pub enum RoomState {
  LOBBY,
  RUNNING,
}

impl Room {
  pub fn has_password(&self) -> bool {
    self.password.is_some()
  }

  pub fn is_full(&self) -> bool {
    if self.size == i32::MAX {
      true
    } else if self.size >= self.max_size {
      false
    } else {
      true
    }
  }

}

#[derive(Debug)]
pub struct User {
  id: String,
  name: Option<String>
}
