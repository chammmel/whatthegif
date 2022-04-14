use std::{sync::{Mutex, Arc}, collections::HashMap};
use tokio::sync::mpsc;

use clap::Parser;
use configuration::Args;
use data_converter::DataResult;
use data_store::Store;

mod configuration;
mod data_converter;
mod data_store;
mod generated;
mod pubsub;
mod router;
mod handler;

#[tokio::main]
async fn main() {
    let args = Args::parse();

    let data_store = Store {
      rooms: HashMap::new()
    };
    let data_store = Mutex::new(data_store);
    let data_store = Arc::new(data_store);

    let (internal_tx, internal_rx) = mpsc::channel::<DataResult>(100);
    let (external_tx, external_rx) = mpsc::channel::<DataResult>(100);

    pubsub::initialize(&args, &data_store);
    router::start(&args, &data_store);
}
