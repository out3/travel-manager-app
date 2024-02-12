# Changelog

This file documents all significant changes to this project.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 
### Changed
- Modified `TravelInfo` to follow application's UI

### Fixed
- Fixed an issue where the frontend was receiving dates as strings instead of `Date` objects

## [0.3.0] - 2024-02-03
### Added
- New UI using TailwindCSS and shadcn/ui
- Travels now defines a currency, a start and end date
- User can now add or edit a travel


- Added tests for `Currency` methods `try_from` and `into`
- Added function `fetchCurrencies` to fetch every currency
- Added function `fetchTravel` to retrieve a travel from its ID
- Added function `updateTravel` to update a travel from its ID
- Added frontend components `TravelAddEditForm`, `TravelADDButtonDialog`, `TravelEditButtonDialog`
- Added frontend form validation for `TravelAddEditForm` using `zodResolver`
- Created a custom hook `useCustomToast` in `src/lib/useCustomToast.tsx` that uses the `toast` hook and provides `toastError` and `toastSuccess` functions.

### Changed
- `Country` parameters type changed from `&'static` to `String`
- Frontend types are now defined on separate files
- Frontend components (`TravelManager`, `TravelList`) are now in separate files

### Fixed
- Fixed an issue in the database code where the database file would not be created if the parent folder did not exist


## [0.2.0] - 2024-01-06
### Added
- `Travel` now defines a `Country` from `iso_country` crate
- Added tests for `Country` methods `try_from` and `into`
- Added function `fetchCountries` to fetch every country

## [0.1.1] - 2023-12-23
### Added
- This CHANGELOG

### Changed
- Switched from NPM to PNPM

### Fixed
- Application now functions correctly when built


## [0.1.0] - 2023-12-22

### Added
- Use of `anyhow` to handle errors 
- Added function `createTravel` to create a new travel

### Changed
- Updated `TravelManager` to support creating a new travel
- Database tables are now created through SQLx Migrations


## [0.1.0] - 2023-12-21

### Added
- Project base setup (Tauri + Vite + React + Typescript)
- Database creation and connection with SQLx
- Introduction of `Travel` interface and command (get_travels)
- Basic `TravelManager` react component, displays created travels

