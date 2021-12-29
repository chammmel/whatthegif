use std::{
    sync::{Arc, Mutex},
    thread::spawn,
};

use redis::Client;

use crate::{data_store::Store, Args};

pub fn initialize(args: &Args, data_store: &Arc<Mutex<Store>>) {
    match args.get_redis() {
        Some(redis) => {
            connect(redis, data_store);
        }
        _ => println!("Running backend in local mode without redis"),
    }
}

fn connect(redis: String, data_store: &Arc<Mutex<Store>>) {
    spawn(move || match Client::open(&*redis) {
        Ok(client) => {
            println!("Connecting ... to redis: {}", &redis);
            match client.get_connection() {
                Ok(mut connection) => {
                    println!("Connected to redis: {}", &redis);
                    let mut pubsub = connection.as_pubsub();
                    pubsub.subscribe("whatthegif").unwrap();

                    spawn(|| {});

                    loop {
                        let msg = pubsub.get_message();
                    }
                }
                Err(_) => println!("Unable to connect to: {}", &redis),
            }
        }
        Err(_) => println!("Invalid url: {}", &redis),
    });
}
