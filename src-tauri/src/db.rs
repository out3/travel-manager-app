use tokio::sync::Mutex;
use sqlx::{Error, Sqlite, SqlitePool};
use sqlx::sqlite::SqliteQueryResult;
use sqlx::migrate::MigrateDatabase;

// Database connector
pub struct DbConnection {
    pub db: Mutex<SqlitePool>,
}

impl DbConnection {
    pub async fn new() -> DbConnection {
        DbConnection {
            db: Mutex::new(SqlitePool::connect(&get_db_path()).await.unwrap())
        }
    }
}

// Database creation
pub async fn init() -> Result<&'static str, String> {
    // Check if SQLite file exists
    if !Sqlite::database_exists(&get_db_path()).await.unwrap_or(false) {
        // If not, create the database
        match Sqlite::create_database(&get_db_path()).await {
            Err(error) => Err(format!("Error while creating database: {}", error)),
            Ok(_) => {
                // If Ok, setup the database and return a database connector
                match setup().await {
                    Ok(_) => Ok("Database created successfully."),
                    Err(error) => Err(format!("Error while database setup: {}", error))
                }
            }
        }
    } else {
        // If database exists, return a database connector
        Ok("Database already exists.")
    }
}

// Database setup
async fn setup() -> Result<SqliteQueryResult, Error> {
    // Create a database connector
    let conn = SqlitePool::connect(&get_db_path()).await.unwrap();
    // Setup database tables
    let init_table = sqlx::query("CREATE TABLE IF NOT EXISTS travel (id INTEGER PRIMARY KEY NOT NULL, country VARCHAR(250) NOT NULL); INSERT INTO travel VALUES (1, \"Korea\")")
        .execute(&conn)
        .await;
    // Return the result of the query
    init_table
}

// Get the path where the database file should be located.
fn get_db_path() -> String {
    let home_dir = dirs::config_dir().unwrap();
    home_dir.to_str().unwrap().to_string() + "/travel-manager-app/database.sqlite"
}

