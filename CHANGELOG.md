# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2023-12-23
### Added
- This CHANGELOG

### Changed
- Use of PNPM instead of NPM

### Fixed
- Application now works when built

## [0.1.0] - 2023-12-22

### Added
- Use of `anyhow` to handle errors 
- Function to create a new travel

### Changed
- Update `TravelManager` to be able to create a new travel
- Database's tables creation through SQLx Migrations

## [0.1.0] - 2023-12-21

### Added
- Project base setup (Tauri + Vite + React + Typescript)
- Database creation and connection with SQLx
- Introduction of `Travel` interface and command (get_travels)
- Basic `TravelManager` react component, displaying travels created

