use clap::Parser;

/// The whatthegif backend
#[derive(Parser, Debug)]
#[clap(about, version, author)]
pub struct Args {
    /// Url to redis
    #[clap(short, long, default_value = "")]
    redis: String,

    /// Origin name
    #[clap(short, long, default_value = "eu-1")]
    origin: String,
}

impl Args {
    pub fn get_redis(&self) -> Option<String> {
        if self.redis.is_empty() {
            None
        } else {
            Some(self.redis.to_string())
        }
    }

    pub fn get_origin(&self) -> Option<String> {
        Some(self.origin.to_string())
    }
}
