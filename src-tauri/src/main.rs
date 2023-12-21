// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use sqlx::FromRow;

mod db;

#[derive(Debug, Clone, FromRow, Serialize)]
struct Travel {
    id: i64,
    country: String,
}

#[tauri::command]
async fn get_travels(conn: tauri::State<'_, db::DbConnection>) -> Result<Vec<Travel>, String> {
    let conn = conn.db.lock().await;
    // Perform query
    let travels = sqlx::query_as::<_, Travel>("SELECT * from travel")
        .fetch_all(&*conn)
        .await
        .map_err(|e| e.to_string());
    travels
}

#[tokio::main]
async fn main() {
    // Database setup
    db::init().await.expect("Error while initialising the database");
    let conn = db::DbConnection::new().await;

    tauri::Builder::default()
        .manage(conn)
        .invoke_handler(tauri::generate_handler![
            get_travels
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
