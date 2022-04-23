use std::{collections::HashMap, sync::Arc};
use tokio::sync::{mpsc, Mutex};

use clap::Parser;
use configuration::Args;
use data_converter::DataResultRequest;
use data_store::Store;

mod configuration;
mod data_converter;
mod data_store;
mod generated;
mod handler;
mod pubsub;
mod router;
mod web_server;

extern crate pretty_env_logger;
#[macro_use]
extern crate log;

#[tokio::main]
async fn main() {
    pretty_env_logger::init();
    let args = Args::parse();

    let data_store = Store {
        rooms: HashMap::new(),
    };
    let data_store = Mutex::new(data_store);
    let data_store = Arc::new(data_store);

    let (internal_tx, internal_rx) = mpsc::channel::<DataResultRequest>(100);
    let (external_tx, external_rx) = mpsc::channel::<DataResultRequest>(100);

    pubsub::initialize(&args, &data_store);
    web_server::start(&args, &data_store).await;
}
