-- ============================================================
-- Sample Data: 20 Scholarship Applications
-- Includes: duplicate student names, missing values (NULL),
-- and old application dates to demonstrate "Days Waiting".
-- ============================================================

INSERT INTO applications
(application_id, student_name, email, phone, scholarship_name, category, amount_requested, amount_sanctioned, stage, applied_date, last_updated, remarks)
VALUES
('SCH-2026-001', 'Aarav Sharma',     'aarav.sharma@example.com',   '9876543210', 'National Merit Scholarship',   'Merit',       50000, 50000, 'Disbursed',    '2025-11-02', '2026-01-10', 'Disbursed in first cycle'),
('SCH-2026-002', 'Priya Verma',      'priya.verma@example.com',    '9876500001', 'State Need-Based Grant',       'Need-based',  30000, NULL,  'Under Review', '2026-06-15', '2026-06-20', NULL),
('SCH-2026-003', 'Rohan Gupta',      NULL,                          '9876500002', 'Sports Excellence Award',      'Sports',      25000, 25000, 'Approved',     '2026-05-20', '2026-06-01', 'Awaiting fund transfer'),
('SCH-2026-004', 'Aarav Sharma',     'aarav.sharma2@example.com',  NULL,          'Minority Welfare Scholarship',  'Minority',    40000, NULL,  'Submitted',    '2026-07-01', '2026-07-01', NULL),
('SCH-2026-005', 'Sneha Reddy',      'sneha.reddy@example.com',    '9876500004', 'National Merit Scholarship',   'Merit',       50000, NULL,  'Rejected',     '2025-09-10', '2025-10-05', 'Incomplete income certificate'),
('SCH-2026-006', 'Vikram Singh',     'vikram.singh@example.com',   '9876500005', 'State Need-Based Grant',       'Need-based',  35000, 35000, 'Disbursed',    '2025-12-01', '2026-01-15', NULL),
('SCH-2026-007', 'Ananya Iyer',      'ananya.iyer@example.com',    '9876500006', NULL,                            'Merit',       NULL,  NULL,  'Submitted',    '2026-07-10', '2026-07-10', 'Pending document upload'),
('SCH-2026-008', 'Priya Verma',      'priya.verma2@example.com',   '9876500007', 'Sports Excellence Award',      'Sports',      20000, 20000, 'Approved',     '2026-04-18', '2026-05-02', NULL),
('SCH-2026-009', 'Karan Mehta',      'karan.mehta@example.com',    NULL,          'Minority Welfare Scholarship',  'Minority',    45000, NULL,  'Under Review', '2026-06-25', '2026-07-05', NULL),
('SCH-2026-010', 'Ishita Bose',      'ishita.bose@example.com',    '9876500009', 'National Merit Scholarship',   'Merit',       50000, 50000, 'Disbursed',    '2025-08-14', '2025-09-30', 'Delayed due to bank KYC'),
('SCH-2026-011', 'Rohan Gupta',      'rohan.gupta2@example.com',   '9876500010', 'State Need-Based Grant',       NULL,          30000, NULL,  'Rejected',     '2026-02-11', '2026-03-01', 'Duplicate application'),
('SCH-2026-012', 'Meera Nair',       'meera.nair@example.com',     '9876500011', 'Sports Excellence Award',      'Sports',      NULL,  NULL,  'Submitted',    '2026-07-15', '2026-07-15', NULL),
('SCH-2026-013', 'Aditya Kulkarni',  'aditya.k@example.com',       '9876500012', 'Minority Welfare Scholarship',  'Minority',    40000, 40000, 'Disbursed',    '2025-10-22', '2025-12-01', NULL),
('SCH-2026-014', 'Divya Pillai',     NULL,                          NULL,          'National Merit Scholarship',   'Merit',       50000, NULL,  'Under Review', '2026-07-01', '2026-07-12', 'Waiting for verification'),
('SCH-2026-015', 'Sneha Reddy',      'sneha.reddy2@example.com',   '9876500014', 'State Need-Based Grant',       'Need-based',  32000, 32000, 'Approved',     '2026-05-30', '2026-06-10', NULL),
('SCH-2026-016', 'Farhan Ahmed',     'farhan.ahmed@example.com',   '9876500015', 'Sports Excellence Award',      'Sports',      22000, NULL,  'Submitted',    '2026-07-18', '2026-07-18', NULL),
('SCH-2026-017', 'Kavya Menon',      'kavya.menon@example.com',    '9876500016', 'Minority Welfare Scholarship',  'Minority',    NULL,  NULL,  'Rejected',     '2025-07-05', '2025-08-01', 'Ineligible category'),
('SCH-2026-018', 'Arjun Desai',      'arjun.desai@example.com',    '9876500017', 'National Merit Scholarship',   'Merit',       50000, 50000, 'Disbursed',    '2025-06-19', '2025-07-30', NULL),
('SCH-2026-019', 'Ishita Bose',      'ishita.bose2@example.com',   '9876500018', 'State Need-Based Grant',       'Need-based',  28000, NULL,  'Under Review', '2026-06-28', '2026-07-08', NULL),
('SCH-2026-020', 'Neha Joshi',       'neha.joshi@example.com',     '9876500019', 'Sports Excellence Award',      'Sports',      21000, 21000, 'Approved',     '2026-07-05', '2026-07-16', NULL);
