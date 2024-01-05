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
pub struct CountryIsoWrapper {
    pub country: CountryCode,
}

impl fmt::Display for CountryIsoWrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.country.name())
    }
}

impl TryFrom<&str> for CountryIsoWrapper {
    type Error = anyhow::Error;
    fn try_from(value: &str) -> anyhow::Result<CountryIsoWrapper> {
        let i = CountryCode::for_alpha3(value)
            .context("CountryIsoWrapper::try_form : Error getting country")?;
        Ok(CountryIsoWrapper {
            country: i
        })
    }
}

impl Into<CountryIsoWrapper> for CountryCode {
    fn into(self) -> CountryIsoWrapper {
        CountryIsoWrapper { country: self }
    }
}

// Trait : SQLX Type/Encode/Decode
impl Type<Sqlite> for CountryIsoWrapper {
    fn type_info() -> SqliteTypeInfo {
        <&str as Type<Sqlite>>::type_info()
    }
}

impl<'q> Encode<'q, Sqlite> for CountryIsoWrapper {
    fn encode_by_ref(&self, args: &mut Vec<SqliteArgumentValue<'q>>) -> IsNull {
        args.push(SqliteArgumentValue::Text(Cow::Borrowed(self.country.alpha3())));

        IsNull::No
    }
}

impl<'r> Decode<'r, Sqlite> for CountryIsoWrapper {
    fn decode(value: SqliteValueRef<'r>) -> Result<Self, BoxDynError> {
        let country_code_str = <&str as Decode<Sqlite>>::decode(value)?;
        let country_code = CountryCode::for_alpha3(country_code_str)?;
        Ok(CountryIsoWrapper {
            country: country_code
        })
    }
}
