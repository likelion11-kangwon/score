use anyhow::Result;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::env;

pub async fn connect() -> Result<Pool<Postgres>> {
    Ok(PgPoolOptions::new()
        .connect(&env::var("DATABASE_URL").unwrap())
        .await?)
}
