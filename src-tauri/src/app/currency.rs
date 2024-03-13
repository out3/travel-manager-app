use std::borrow::Cow;
use std::fmt;

use iso_currency;
use serde::Serialize;
use sqlx::{Decode, Encode, Sqlite, Type};
use sqlx::encode::IsNull;
use sqlx::error::BoxDynError;
use sqlx::sqlite::{SqliteArgumentValue, SqliteTypeInfo, SqliteValueRef};

#[derive(Serialize, Clone, Debug, PartialEq)]
pub struct Currency {
    pub code: String,
    pub symbol: String,
    pub exponent: u16,
}

impl fmt::Display for Currency {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} ({})", &self.code.to_uppercase(), &self.symbol)
    }
}

impl TryFrom<&str> for Currency {
    type Error = anyhow::Error;
    fn try_from(value: &str) -> anyhow::Result<Currency> {
        let i: iso_currency::Currency = iso_currency::Currency::from_code(value)
            .ok_or(anyhow::Error::msg("Currency::try_from : Currency unknown"))?;

        Ok(Currency {
            code: i.code().to_string(),
            symbol: i.symbol().symbol.to_string(),
            exponent: i.exponent().unwrap_or_else(|| 0),
        })
    }
}

impl Into<Currency> for iso_currency::Currency {
    fn into(self) -> Currency {
        Currency {
            code: self.code().to_string(),
            symbol: self.symbol().symbol.to_string(),
            exponent: self.exponent().unwrap_or_else(|| 0)
        }
    }
}

// Trait : SQLX Type/Encode/Decode
impl Type<Sqlite> for Currency {
    fn type_info() -> SqliteTypeInfo {
        <&str as Type<Sqlite>>::type_info()
    }
}

impl<'q> Encode<'q, Sqlite> for Currency {
    fn encode_by_ref(&self, args: &mut Vec<SqliteArgumentValue<'q>>) -> IsNull {
        args.push(SqliteArgumentValue::Text(Cow::Owned(self.clone().code)));

        IsNull::No
    }
}

impl<'r> Decode<'r, Sqlite> for Currency {
    fn decode(value: SqliteValueRef<'r>) -> Result<Self, BoxDynError> {
        let currency_code_str = <&str as Decode<Sqlite>>::decode(value)?;
        let currency = iso_currency::Currency::from_code(currency_code_str)
            .ok_or("Currency unknown")?;
        Ok(Currency {
            code: currency.code().into(),
            symbol: currency.symbol().symbol.into(),
            exponent: currency.exponent().unwrap_or_else(|| 0),
        })
    }
}

// Tauri commands
#[tauri::command]
pub fn get_currencies() -> Vec<Currency> {
    use iso_currency::IntoEnumIterator;

    iso_currency::Currency::iter()
        .map(|i| i.into())
        .collect()
}