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
  name: String,
  size: u8,
  max_size: u8,
  password: Option<String>,
  users: Vec<User>
}

impl Room {
  pub fn has_password(&self) -> bool {
    self.password.is_some()
  }

  pub fn is_full(&self) -> bool {
    if self.max_size == u8::MAX {
      false
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
