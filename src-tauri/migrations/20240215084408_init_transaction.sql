-- Initialise Transaction table
CREATE TABLE IF NOT EXISTS "transaction"
(
    travel_id INTEGER NOT NULL DEFAULT '-1',
    description TEXT NOT NULL DEFAULT 'Unknown',
    amount REAL NOT NULL DEFAULT '0.0',
    currency TEXT NOT NULL DEFAULT 'EUR',
    transaction_date TEXT NOT NULL DEFAULT '1900-01-01',
    notes TEXT
);
