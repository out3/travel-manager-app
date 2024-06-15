-- Adding a currency column to the travel table
ALTER TABLE travel
    ADD currency TEXT NOT NULL DEFAULT 'EUR';