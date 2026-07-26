-- ============================================================
-- Student Scholarship Application and Disbursement Tracker
-- Database Schema (SQLite)
-- ============================================================

DROP TABLE IF EXISTS applications;

CREATE TABLE applications (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id      TEXT NOT NULL UNIQUE,        -- e.g. SCH-2026-001
    student_name        TEXT NOT NULL,
    email               TEXT,
    phone               TEXT,
    scholarship_name     TEXT,
    category            TEXT,                         -- Merit / Need-based / Sports / Minority
    amount_requested     REAL,
    amount_sanctioned    REAL,
    stage               TEXT NOT NULL DEFAULT 'Submitted',
                        -- Submitted, Under Review, Approved, Disbursed, Rejected
    applied_date        TEXT NOT NULL,                -- ISO date YYYY-MM-DD
    last_updated         TEXT NOT NULL,
    remarks             TEXT,
    created_at          TEXT DEFAULT (datetime('now')),
    updated_at          TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_student_name ON applications (student_name);
CREATE INDEX idx_stage ON applications (stage);
CREATE INDEX idx_application_id ON applications (application_id);
