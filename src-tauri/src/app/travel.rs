use isocountry::CountryCode;
use serde::Serialize;
use sqlx::FromRow;
use chrono::NaiveDate;

use crate::app::country::Country;
use crate::app::currency::Currency;
use crate::db;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Travel {
    rowid: i64,
    country: Country,
    currency: Currency,
    start_date: Option<NaiveDate>,
    end_date: Option<NaiveDate>
}

// Get all travels
#[tauri::command]
pub async fn get_travels(
    conn: tauri::State<'_, db::DbConnection>
) -> Result<Vec<Travel>, String> {
    // Lock mutex
    let conn = conn.db.lock().await;

    // Perform query
    let all_travels = sqlx::query_as::<_, Travel>(r#"
        SELECT ROWID, *
        FROM travel
    "#,
    )
        .fetch_all(&*conn)
        .await
        .map_err(|e| e.to_string());
    all_travels
}

// Create one travel
#[tauri::command]
pub async fn create_travel(
    conn: tauri::State<'_, db::DbConnection>,
    country: String,
    currency: String
) -> Result<Travel, String> {
    // Lock mutex
    let conn = conn.db.lock().await;

    // Create country and currency object
    let country_wrapper: Country = CountryCode::for_alpha3(&*country)
        .map_err(|e| e.to_string())?
        .into();
    let currency_wrapper: Currency = iso_currency::Currency::from_code(&*currency)
        .ok_or("Currency unknown".to_string())?
        .into();

    // Perform query
    let travel_created = sqlx::query_as::<_, Travel>("
        INSERT INTO travel (country, currency, start_date, end_date)
        VALUES ($1, $2, $3, $4)
        RETURNING ROWID, *
    ")
        .bind(country_wrapper)
        .bind(currency_wrapper)
        .bind(NaiveDate::from_num_days_from_ce_opt(1))
        .bind(NaiveDate::from_num_days_from_ce_opt(2))
        .fetch_one(&*conn)
        .await
        .map_err(|e| e.to_string());
    travel_created
}
