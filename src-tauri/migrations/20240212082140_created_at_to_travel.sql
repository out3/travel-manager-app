-- Add the created_at column to the travel table
ALTER TABLE travel ADD created_at TEXT;
-- Set the created_at column to the current date by default
UPDATE travel SET created_at = date('now');