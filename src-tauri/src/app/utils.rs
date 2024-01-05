use isocountry::CountryCode;
use serde::Serialize;

// Struct use
#[derive(Serialize)]
pub struct Country {
    code: String,
    name: String,
}

#[tauri::command]
pub fn get_countries() -> Vec<Country> {
    CountryCode::iter()
        .map(|i| Country {
            code: i.alpha3().into(),
            name: i.name().into(),
        })
        .collect()
}
