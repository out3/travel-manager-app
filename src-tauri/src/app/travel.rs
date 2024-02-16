use isocountry::CountryCode;
use serde::Serialize;
use sqlx::FromRow;
use chrono::NaiveDate;

use crate::app::country::Country;
use crate::app::currency::Currency;
use crate::db;

pub type TravelId = i64;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Travel {
    rowid: TravelId,
    created_at: NaiveDate,
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
        FROM "travel"
    "#,
    )
        .fetch_all(&*conn)
        .await
        .map_err(|e| e.to_string());
    all_travels
}

// Get one travel
#[tauri::command]
pub async fn get_travel(
    conn: tauri::State<'_, db::DbConnection>,
    travel_id: TravelId
) -> Result<Travel, String> {
    // Lock mutex
    let conn = conn.db.lock().await;

    // Get travel from id
    let travel = sqlx::query_as::<_, Travel>(r#"
        SELECT ROWID, *
        FROM "travel"
        WHERE ROWID = $1
    "#,
    )
        .bind(travel_id.to_string())
        .fetch_one(&*conn)
        .await
        .map_err(|_| "Travel not found".to_string());
    travel
}

// Create one travel
#[tauri::command]
pub async fn create_travel(
    conn: tauri::State<'_, db::DbConnection>,
    country: String,
    currency: String,
    start_date: String,
    end_date: String
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

    // Handle dates
    // Convert string dates to Option<NaiveDate>
    let start_date: Option<NaiveDate> = NaiveDate::parse_from_str(&*start_date, "%d/%m/%Y")
        .ok();
    let end_date: Option<NaiveDate> = NaiveDate::parse_from_str(&*end_date, "%d/%m/%Y")
        .ok();

    // Start date can not be null if end date is defined
    if let (None, Some(_)) = (start_date, end_date) {
        return Err("Start date must be specified if end date is defined".to_string());
    }

    // End date must be after start date
    if let (Some(start_date), Some(end_date)) = (start_date, end_date) {
            if start_date > end_date {
                return Err("End date must be after start date".to_string());
            }
    }


    // Perform query
    let travel_created = sqlx::query_as::<_, Travel>(r#"
        INSERT INTO "travel" (created_at, country, currency, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING ROWID, *
    "#)
        .bind(chrono::Local::now().naive_local()) // Today's date
        .bind(country_wrapper)
        .bind(currency_wrapper)
        .bind(start_date)
        .bind(end_date)
        .fetch_one(&*conn)
        .await
        .map_err(|e| e.to_string());
    travel_created
}


// Update one travel
#[tauri::command]
pub async fn update_travel(
    conn: tauri::State<'_, db::DbConnection>,
    travel_id: i64,
    country: String,
    currency: String,
    start_date: String,
    end_date: String
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

    // Handle dates
    // Convert string dates to Option<NaiveDate>
    let start_date: Option<NaiveDate> = NaiveDate::parse_from_str(&*start_date, "%d/%m/%Y")
        .ok();
    let end_date: Option<NaiveDate> = NaiveDate::parse_from_str(&*end_date, "%d/%m/%Y")
        .ok();

    // Start date can not be null if end date is defined
    if let (None, Some(_)) = (start_date, end_date) {
        return Err("Start date must be specified if end date is defined".to_string());
    }

    // End date must be after start date
    if let (Some(start_date), Some(end_date)) = (start_date, end_date) {
        if start_date > end_date {
            return Err("End date must be after start date".to_string());
        }
    }


    // Perform query
    let travel_updated = sqlx::query_as::<_, Travel>(r#"
        UPDATE "travel"
        SET ("country", "currency", "start_date", "end_date")
            = ($2, $3, $4, $5)
        WHERE ROWID = $1
        RETURNING ROWID, *
    "#)
        .bind(travel_id)
        .bind(country_wrapper)
        .bind(currency_wrapper)
        .bind(start_date)
        .bind(end_date)
        .fetch_one(&*conn)
        .await
        .map_err(|e| e.to_string());
    travel_updated
}