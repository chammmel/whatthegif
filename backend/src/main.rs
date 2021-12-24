mod data_converter;
mod generated;

use std::{net::TcpListener, thread::spawn};

use tungstenite::{
    accept_hdr,
    handshake::server::{Request, Response},
};

/// A WebSocket echo server
fn main() {
    let server = TcpListener::bind("127.0.0.1:8080").unwrap();
    for stream in server.incoming() {
        spawn(move || {
            let callback = |req: &Request, response: Response| {
                println!("The request's path is: {}", req.uri().path());
                Ok(response)
            };
            let mut websocket = accept_hdr(stream.unwrap(), callback).unwrap();

            loop {
                let msg = websocket.read_message().unwrap();

                if msg.is_binary() {
                    let message = data_converter::get_message(msg.into_data());
                    println!("{:?}", message);

                    data_converter::data_parser(message);
                }
            }
        });
    }
}
