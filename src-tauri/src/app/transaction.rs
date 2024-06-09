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

#[tauri::command]
pub async fn create_transaction(
    conn: tauri::State<'_, db::DbConnection>,
    travel_id: TravelId,
    description: String,
    amount: f64,
    currency: String,
    transaction_date: String,
    notes: String,
) -> Result<Transaction, String> {
    // Lock mutex
    let conn = conn.db.lock().await;

    // Create Currency object
    let currency_wrapper: Currency = iso_currency::Currency::from_code(&*currency)
        .ok_or("Currency unknown".to_string())?
        .into();

    // Convert string date to Option<NaiveDate>
    let transaction_date: Option<NaiveDate> = NaiveDate::parse_from_str(&*transaction_date, "%d/%m/%Y")
        .ok();

    // Verifications
    // Amount decimal must follow currency's exponent
    let currency_exponent = currency_wrapper.exponent;
    if (amount.fract() > 0.0) && amount.fract().to_string().len() > currency_exponent as usize {
        return Err("Amount decimal must follow currency's exponent".to_string());
    }

    // Perform query
    let transaction_created = sqlx::query_as::<_, Transaction>(r#"
        INSERT INTO "transaction" (travel_id, description, amount, currency, transaction_date, notes)
        values ($1, $2, $3, $4, $5, $6)
        RETURNING ROWID, *
    "#)
        .bind(travel_id)
        .bind(description)
        .bind(amount)
        .bind(currency_wrapper)
        .bind(transaction_date)
        .bind(notes)
        .fetch_one(&*conn)
        .await
        .map_err(|e| e.to_string());
    transaction_created
}

#[tauri::command]
pub async fn update_transaction(
    conn: tauri::State<'_, db::DbConnection>,
    transaction_id: TransactionId,
    travel_id: TravelId,
    description: String,
    amount: f64,
    currency: String,
    transaction_date: String,
    notes: String,
) -> Result<Transaction, String> {
    // Lock mutex
    let conn = conn.db.lock().await;

    // Create Currency object
    let currency_wrapper: Currency = iso_currency::Currency::from_code(&*currency)
        .ok_or("Currency unknown".to_string())?
        .into();

    // Convert string date to Option<NaiveDate>
    let transaction_date: Option<NaiveDate> = NaiveDate::parse_from_str(&*transaction_date, "%d/%m/%Y")
        .ok();

    // Verifications
    // Amount decimal must follow currency's exponent
    let currency_exponent = currency_wrapper.exponent;
    if (amount.fract() > 0.0) && amount.fract().to_string().len() > currency_exponent as usize {
        return Err("Amount decimal must follow currency's exponent".to_string());
    }

    // Perform query
    let transaction_updated = sqlx::query_as::<_, Transaction>(r#"
        UPDATE "transaction"
        SET (travel_id, description, amount, currency, transaction_date, notes)
            = ($2, $3, $4, $5, $6, $7)
        WHERE ROWID = $1
        RETURNING ROWID, *
    "#)
        .bind(transaction_id)
        .bind(travel_id)
        .bind(description)
        .bind(amount)
        .bind(currency_wrapper)
        .bind(transaction_date)
        .bind(notes)
        .fetch_one(&*conn)
        .await
        .map_err(|e| e.to_string());
    transaction_updated
}