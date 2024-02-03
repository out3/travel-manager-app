-- Add migration script here
ALTER TABLE travel
    ADD currency TEXT NOT NULL DEFAULT 'EUR';