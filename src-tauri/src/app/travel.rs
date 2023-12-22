use serde::Serialize;
use sqlx::FromRow;

use crate::db;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Travel {
    rowid: i64,
    country: String,
}

// Get all travels
#[tauri::command]
pub(crate) async fn get_travels(
    conn: tauri::State<'_, db::DbConnection>
) -> Result<Vec<Travel>, String> {
    // Lock mutex
    let conn = conn.db.lock().await;

    // Perform query
    let all_travels = sqlx::query_as::<_, Travel>("\
        SELECT ROWID, * \
        FROM travel \
    ",
    )
        .fetch_all(&*conn)
        .await
        .map_err(|e| e.to_string());
    all_travels
}

// Create one travel
#[tauri::command]
pub(crate) async fn create_travel(
    conn: tauri::State<'_, db::DbConnection>,
    country: String,
) -> Result<Travel, String> {
    // Lock mutex
    let conn = conn.db.lock().await;

    // Perform query
    let travel_created = sqlx::query_as::<_, Travel>("\
        INSERT INTO travel (country)\
        VALUES(?) \
        RETURNING ROWID, *
    ")
        .bind(country)
        .fetch_one(&*conn)
        .await
        .map_err(|e| e.to_string());
    travel_created
}
