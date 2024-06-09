#[cfg(test)]
mod tests {
    use isocountry::CountryCode;

    use crate::app::country::Country;
    use crate::app::currency::Currency;

    // Country tests
    #[test]
    fn country_try_from() {
        // Try from : success
        // Equality : success
        assert_eq!(Country::try_from("FRA").expect("").code, CountryCode::FRA.alpha3());
        assert_eq!(Country::try_from("KOR").expect("").code, CountryCode::KOR.alpha3());
        // try_form : success
        // Equality : failed
        assert_ne!(Country::try_from("FRA").expect("").code, CountryCode::KOR.alpha3());
        assert_ne!(Country::try_from("KOR").expect("").code, CountryCode::FRA.alpha3());
        // Try_form : failed
        assert!(Country::try_from("AAA").is_err());
    }

    #[test]
    fn country_into() {
        // Into : success
        let country_into: Country = CountryCode::FRA.into();
        assert_eq!(country_into, Country {
            code: String::from("FRA"),
            name: String::from("France"),
        })
    }

    // Currency tests
    #[test]
    fn currency_try_form() {
        // Try from : success
        // Equality : success
        assert_eq!(Currency::try_from("EUR").expect("").code, iso_currency::Currency::EUR.code());
        assert_eq!(Currency::try_from("KRW").expect("").code, iso_currency::Currency::KRW.code());
        // try_form : success
        // Equality : failed
        assert_ne!(Currency::try_from("EUR").expect("").code, iso_currency::Currency::KRW.code());
        assert_ne!(Currency::try_from("KRW").expect("").code, iso_currency::Currency::EUR.code());
        // Try_form : failed
        assert!(Currency::try_from("AAA").is_err());
    }

    #[test]
    fn currency_into() {
        // Into : success
        let currency_into: Currency = iso_currency::Currency::EUR.into();
        assert_eq!(currency_into, Currency {
            code: iso_currency::Currency::EUR.code().parse().unwrap(),
            symbol: iso_currency::Currency::EUR.symbol().symbol.parse().unwrap(),
            exponent: iso_currency::Currency::EUR.exponent().unwrap_or_else(|| 0),
        })
    }
}