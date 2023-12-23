// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;
mod db;

#[tokio::main]
async fn main() {
    // Database setup
    db::init().await.expect("Error while initialising the database");
    let conn = db::DbConnection::new().await;

    tauri::Builder::default()
        .manage(conn)
        .invoke_handler(tauri::generate_handler![
            app::travel::get_travels,
            app::travel::create_travel,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}