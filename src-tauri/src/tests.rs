#[cfg(test)]
mod tests {
    use isocountry::CountryCode;

    use crate::app::country::Country;

    // CountryIsoWrapper tests
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
}