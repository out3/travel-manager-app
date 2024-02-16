use chrono::NaiveDate;
use serde::Serialize;
use sqlx::FromRow;

use crate::app::currency::Currency;
use crate::app::travel::TravelId;
use crate::db;

pub type TransactionId = i64;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Transaction {
    rowid: TransactionId,
    travel_id: TravelId,
    description: String,
    amount: f64,
    currency: Currency,
    transaction_date: NaiveDate,
    notes: String
}

#[tauri::command]
pub async fn get_transactions_for_travel(
    conn: tauri::State<'_, db::DbConnection>,
    travel_id: TravelId
) -> Result<Vec<Transaction>, String> {
    // Lock mutex
    let conn = conn.db.lock().await;

    // Get travel from id
    let all_transactions = sqlx::query_as::<_, Transaction>(r#"
        SELECT ROWID, *
        FROM "transaction"
        WHERE travel_id = $1
    "#,
    )
        .bind(travel_id.to_string())
        .fetch_all(&*conn)
        .await
        .map_err(|e| e.to_string());
    all_transactions
}