use anyhow::Context;
use sqlx::{Sqlite, SqlitePool};
use sqlx::migrate::MigrateDatabase;
use sqlx::sqlite::SqliteQueryResult;
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
    if Sqlite::database_exists(&get_db_path())
        .await
        .context("db::init : Check db exist")?
    {
        return Ok("Database already exists.");
    }

    // If not, create the database
    Sqlite::create_database(&get_db_path())
        .await
        .context("db::init : Create database")?;

    // If database created, setup the new database
    setup().await.context("db::init : Setup database")?;

    Ok("Database created successfully.")
}

// Database setup
async fn setup() -> anyhow::Result<SqliteQueryResult> {
    // Create a database connector
    let conn = SqlitePool::connect(&get_db_path())
        .await
        .context("db::setup : Create database connector")?;

    // Setup database tables
    let init_table = sqlx::query("CREATE TABLE IF NOT EXISTS travel (country VARCHAR(250) NOT NULL)")
        .execute(&conn)
        .await
        .context("db::setup : Performing query")?;

    // Return the result of the query
    Ok(init_table)
}

// Get the path where the database file should be located.
fn get_db_path() -> String {
    // In Windows : Use %appdata% folder to store database file
    let home_dir = dirs::config_dir().unwrap();
    home_dir.to_str().unwrap().to_string() + "/travel-manager-app/database.sqlite"
}