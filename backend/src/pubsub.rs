use redis::Client;

use crate::{data_store::DataStore, Args};

pub fn initialize(args: &Args, data_store: &DataStore) {
    match args.get_redis() {
        Some(redis) => {
            connect(redis, data_store);
        }
        _ => log::debug!("Running backend in local mode without redis"),
    }
}

fn connect(redis: String, data_store: &DataStore) {
    tokio::spawn(async move {
        match Client::open(&*redis) {
            Ok(client) => {
                log::debug!("Connecting ... to redis: {redis}");
                match client.get_connection() {
                    Ok(mut connection) => {
                        log::debug!("Connected to redis: {redis}");
                        let mut pubsub = connection.as_pubsub();
                        pubsub.subscribe("whatthegif").unwrap();

                        loop {
                            let msg = pubsub.get_message();
                        }
                    }
                    Err(_) => log::debug!("Unable to connect to: {redis}"),
                }
            }
            Err(_) => log::debug!("Invalid url: {redis}"),
        }
    });
}
