use std::{sync::{mpsc::channel, Mutex, Arc}, collections::HashMap};

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

fn main() {
    let args = Args::parse();

    let data_store = Store {
      rooms: HashMap::new()
    };
    let data_store = Mutex::new(data_store);
    let data_store = Arc::new(data_store);

    let (internal_tx, internal_rx): _ = channel::<DataResult>();
    let (external_tx, external_rx): _ = channel::<DataResult>();

    pubsub::initialize(&args, &data_store);
    router::start(&args, &data_store);
}
