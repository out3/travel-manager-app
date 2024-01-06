use anyhow::Context;
use sqlx::{Sqlite, SqlitePool};
use sqlx::migrate::MigrateDatabase;
use tokio::sync::Mutex;

// Database connector
pub struct DbConnection {
    pub db: Mutex<SqlitePool>,
}

impl DbConnection {
    pub async fn new() -> DbConnection {
        DbConnection {
            db: Mutex::new(SqlitePool::connect(&get_db_path()).await.unwrap()),
        }
    }
}

// Database creation
pub async fn init() -> anyhow::Result<&'static str> {
    // Check if SQLite file exists
    if !Sqlite::database_exists(&get_db_path())
        .await
        .context("db::init : Check db exist")?
    {
    // If not, create the database
    Sqlite::create_database(&get_db_path())
        .await
        .context("db::init : Create database")?;
    }

    // Apply migrations in both cases,
    // in case the database struct has changed
    setup().await.context("db::init : Setup database")?;

    Ok("Database initialised successfully.")
}

// Database setup
async fn setup() -> anyhow::Result<()> {
    // Create a database connector
    let conn = SqlitePool::connect(&get_db_path())
        .await
        .context("db::setup : Create database connector")?;

    // Apply migrations
    let migrations_result = sqlx::migrate!("./migrations")
        .run(&conn)
        .await
        .context("db::setup : Performing migrations")?;
    // Return the result of the query

    Ok(migrations_result)
}

// Get the path where the database file should be located.
fn get_db_path() -> String {
    // In Windows : Use %appdata% folder to store database file
    let home_dir = dirs::config_dir().unwrap();
    home_dir.to_str().unwrap().to_string() + "/travel-manager-app/database.sqlite"
}