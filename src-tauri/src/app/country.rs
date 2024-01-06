use std::borrow::Cow;
use std::fmt;

use anyhow::Context;
use isocountry::CountryCode;
use serde::Serialize;
use sqlx::{Decode, Encode, Sqlite, Type};
use sqlx::encode::IsNull;
use sqlx::error::BoxDynError;
use sqlx::sqlite::{SqliteArgumentValue, SqliteTypeInfo, SqliteValueRef};

#[derive(Serialize, Clone, Debug, PartialEq)]
pub struct Country {
    pub code: &'static str,
    pub name: &'static str,
}

impl fmt::Display for Country {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.name)
    }
}

impl TryFrom<&str> for Country {
    type Error = anyhow::Error;
    fn try_from(value: &str) -> anyhow::Result<Country> {
        let i = CountryCode::for_alpha3(value)
            .context("CountryIsoWrapper::try_form : Error getting country")?;
        Ok(Country {
            code: i.alpha3(),
            name: i.name()
        })
    }
}

impl Into<Country> for CountryCode {
    fn into(self) -> Country {
        Country {
            code: self.alpha3(),
            name: self.name()
        }
    }
}

// Trait : SQLX Type/Encode/Decode
impl Type<Sqlite> for Country {
    fn type_info() -> SqliteTypeInfo {
        <&str as Type<Sqlite>>::type_info()
    }
}

impl<'q> Encode<'q, Sqlite> for Country {
    fn encode_by_ref(&self, args: &mut Vec<SqliteArgumentValue<'q>>) -> IsNull {
        args.push(SqliteArgumentValue::Text(Cow::Borrowed(self.code)));

        IsNull::No
    }
}

impl<'r> Decode<'r, Sqlite> for Country {
    fn decode(value: SqliteValueRef<'r>) -> Result<Self, BoxDynError> {
        let country_code_str = <&str as Decode<Sqlite>>::decode(value)?;
        let country_code = CountryCode::for_alpha3(country_code_str)?;
        Ok(Country {
            code: country_code.alpha3(),
            name: country_code.name()
        })
    }
}

// Tauri commands
#[tauri::command]
pub fn get_countries() -> Vec<Country> {
    CountryCode::iter()
        .map(|i| (*i).into())
        .collect()
}