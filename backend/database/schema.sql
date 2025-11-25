-- ==========================================================
-- Hospital Portal Database Schema (Static Parents Version)
-- ==========================================================

DROP DATABASE IF EXISTS hospital_portal;
CREATE DATABASE hospital_portal;
USE hospital_portal;

-- ==========================================================
-- 1. MEDICAL TEAM TABLE
-- ==========================================================
CREATE TABLE medical_team (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
role ENUM('Doctor', 'Nurse', 'Specialist', 'Therapist', 'Admin') NOT NULL,
department VARCHAR(100),
contact_email VARCHAR(255),
contact_phone VARCHAR(50),
profile_notes TEXT,
photo_url VARCHAR(255),
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO medical_team (name, role, department, contact_email, contact_phone, profile_notes) VALUES
('Dr. Sarah Smith', 'Doctor', 'Pediatrics', 'sarah.smith@hospital.org', '01234 111222', 'Specialist in childhood respiratory conditions.'),
('Nurse Emma Brown', 'Nurse', 'Outpatient Care', 'emma.brown@hospital.org', '01234 333444', 'Provides follow-up and aftercare support.'),
('Dr. James Green', 'Specialist', 'Cardiology', 'james.green@hospital.org', '01234 555666', 'Focuses on pediatric heart health.'),
('Dr. Olivia White', 'Doctor', 'Neurology', 'olivia.white@hospital.org', '01234 777888', 'Specializes in pediatric neurological disorders.'),
('Dr. Chloe Patel', 'Doctor', 'Oncology', 'chloe.patel@hospital.org', '01234 222333', 'Expert in childhood cancer treatments.'),
('Dr. Ethan Jones', 'Doctor', 'Orthopedics', 'ethan.jones@hospital.org', '01234 666777', 'Treats bone and joint conditions in children.'),
('Dr. Daniel Wilson', 'Doctor', 'Gastroenterology', 'daniel.wilson@hospital.org', '01234 121314', 'Specialist in pediatric digestive health.'),
('Nurse Liam Turner', 'Nurse', 'Intensive Care', 'liam.turner@hospital.org', '01234 999000', 'Experienced in critical care for young patients.'),
('Nurse Sophie Clark', 'Nurse', 'Emergency', 'sophie.clark@hospital.org', '01234 444555', 'Works in emergency response and triage.'),
('Nurse Ava Martin', 'Nurse', 'Cardiology', 'ava.martin@hospital.org', '01234 888999', 'Supports cardiac patients and post-surgery care.');

-- ==========================================================
-- 2. PATIENTS TABLE
-- ==========================================================
CREATE TABLE patients (
id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
dob DATE NOT NULL,
gender ENUM('Male','Female','Other') DEFAULT 'Other',
address VARCHAR(255),
contact_phone VARCHAR(50),
guardian_id INT NULL,
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO patients (first_name, last_name, dob, gender, address, contact_phone, notes) VALUES
('Emily','Johnson','2022-06-15','Female','12 Oak Street, Glasgow','07891 223344','Asthma – regular check-ups with Dr. Sarah Smith.'),
('Mia','Patel','2022-08-10','Female','9 Willow Crescent, Paisley','07891 445566','Epilepsy – managed with medication.'),
('Sophia','White','2022-04-05','Female','19 Pine Close, Glasgow','07891 889900','Heart murmur – monitored by Dr. James Green.'),
('Grace','Lewis','2023-01-20','Female','8 Cedar Grove, Glasgow','07891 333444','Post-surgery recovery – supervised by Dr. James Green.'),
('Liam','Brown','2014-06-15','Male','45 Maple Avenue, Glasgow','07891 334455','Congenital heart defect – under care of Dr. James Green.'),
('Noah','Wilson','2014-05-20','Male','33 Birch Lane, East Kilbride','07891 556677','Recovering from a broken leg – physiotherapy ongoing.'),
('Ava','Thompson','2015-05-18','Female','21 Cherry Road, Glasgow','07891 667788','Leukemia – ongoing treatment with Dr. Chloe Patel.'),
('Oliver','Evans','2015-09-04','Male','88 Spruce Street, Hamilton','07891 778899','Ulcerative colitis – monitored by Dr. Daniel Wilson.'),
('Benjamin','Hall','2014-08-30','Male','4 Hawthorn Drive, Glasgow','07891 990011','Fractured arm – follow-up with Dr. Ethan Jones.'),
('Lucas','Scott','2015-06-11','Male','15 Poplar Street, Glasgow','07891 222333','Food allergies – advised by Dr. Sarah Smith.'),
('Isabella','King','2014-12-15','Female','62 Rowan Way, Glasgow','07891 111222','Chronic migraines – under review by Dr. Olivia White.'),
('Jacob','Moore','2015-03-19','Male','27 Elm Road, Glasgow','07891 444555','Sports injury – attending rehab with Dr. Ethan Jones.');

-- ==========================================================
-- 3. USERS TABLE
-- ==========================================================
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(100) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
role ENUM('patient','parent','doctor','nurse','admin') NOT NULL,
patient_id INT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

-- Staff accounts
INSERT INTO users (username, password_hash, role) VALUES
('dr_smith','Password123!','doctor'),
('nurse_brown','Password123!','nurse'),
('dr_green','Password123!','doctor'),
('dr_white','Password123!','doctor'),
('dr_patel','Password123!','doctor'),
('dr_jones','Password123!','doctor');

-- Patient accounts
INSERT INTO users (username, password_hash, role, patient_id)
SELECT LOWER(CONCAT(first_name,'_',last_name)), 'Password123!', 'patient', id
FROM patients;

-- ==========================================================
-- 4. STATIC PARENT USERS (MANUALLY DEFINED)
-- ==========================================================
INSERT INTO users (username, password_hash, role) VALUES
('brian_johnson','Password123!','parent'),
('raj_patel','Password123!','parent'),
('james_white','Password123!','parent'),
('michael_lewis','Password123!','parent'),
('david_brown','Password123!','parent'),
('peter_wilson','Password123!','parent'),
('mark_thompson','Password123!','parent'),
('steven_evans','Password123!','parent'),
('john_hall','Password123!','parent'),
('alan_scott','Password123!','parent'),
('robert_king','Password123!','parent'),
('kevin_moore','Password123!','parent');

-- ==========================================================
-- 5. PARENT-CHILD LINKS
-- ==========================================================
CREATE TABLE parent_child (
id INT AUTO_INCREMENT PRIMARY KEY,
parent_user_id INT NOT NULL,
patient_id INT NOT NULL,
relationship VARCHAR(50) DEFAULT 'parent',
FOREIGN KEY (parent_user_id) REFERENCES users(id),
FOREIGN KEY (patient_id) REFERENCES patients(id)
);

INSERT INTO parent_child (parent_user_id, patient_id) VALUES
((SELECT id FROM users WHERE username='brian_johnson'), 1),
((SELECT id FROM users WHERE username='raj_patel'), 2),
((SELECT id FROM users WHERE username='james_white'), 3),
((SELECT id FROM users WHERE username='michael_lewis'), 4),
((SELECT id FROM users WHERE username='david_brown'), 5),
((SELECT id FROM users WHERE username='peter_wilson'), 6),
((SELECT id FROM users WHERE username='mark_thompson'), 7),
((SELECT id FROM users WHERE username='steven_evans'), 8),
((SELECT id FROM users WHERE username='john_hall'), 9),
((SELECT id FROM users WHERE username='alan_scott'), 10),
((SELECT id FROM users WHERE username='robert_king'), 11),
((SELECT id FROM users WHERE username='kevin_moore'), 12);

-- ==========================================================
-- 6. PATIENT TEAM (unchanged)
-- ==========================================================
CREATE TABLE patient_team (
id INT AUTO_INCREMENT PRIMARY KEY,
patient_id INT NOT NULL,
team_member_id INT NOT NULL,
relationship VARCHAR(50) DEFAULT 'Primary Doctor',
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (patient_id) REFERENCES patients(id),
FOREIGN KEY (team_member_id) REFERENCES users(id)
);

DELETE FROM patient_team;

INSERT INTO patient_team (patient_id, team_member_id, relationship)
SELECT p.id, d.id, 'Primary Doctor'
FROM patients p
JOIN (SELECT id FROM users WHERE role='doctor' ORDER BY RAND()) d
GROUP BY p.id;

INSERT INTO patient_team (patient_id, team_member_id, relationship)
SELECT p.id, n.id, 'Nurse'
FROM patients p
JOIN (SELECT id FROM users WHERE role='nurse' ORDER BY RAND()) n
GROUP BY p.id;

-- ==========================================================
-- 7. APPOINTMENTS TABLE
-- ==========================================================
CREATE TABLE appointments (
id INT AUTO_INCREMENT PRIMARY KEY,
patient_id INT NOT NULL,
doctor_id INT NULL,
appointment_date DATETIME NOT NULL,
location VARCHAR(255),
purpose VARCHAR(255),
status ENUM('upcoming','completed','cancelled') DEFAULT 'upcoming',
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL
);

DELETE FROM appointments;

INSERT INTO appointments (patient_id, doctor_id, appointment_date, location, purpose)
SELECT p.id, pt.team_member_id, DATE_ADD('2025-12-01', INTERVAL p.id DAY), CONCAT('Room ', p.id), 'Checkup'
FROM patients p
JOIN patient_team pt ON pt.patient_id = p.id AND pt.relationship='Primary Doctor';

-- ==========================================================
-- 8. MEDICINES TABLE (unchanged)
-- ==========================================================
CREATE TABLE medicines (
id INT AUTO_INCREMENT PRIMARY KEY,
patient_id INT NOT NULL,
medicine_name VARCHAR(100) NOT NULL,
dosage VARCHAR(50) NOT NULL,
frequency VARCHAR(100) NOT NULL,
start_date DATE NOT NULL,
end_date DATE,
prescribed_by VARCHAR(100),
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

INSERT INTO medicines (patient_id, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, notes) VALUES
(1, 'Albuterol', '2 puffs', 'Every 4 hours', '2025-11-01', '2025-12-01', 'Dr. Sarah Smith', 'For asthma management.'),
(2, 'Levetiracetam', '250 mg', 'Twice daily', '2025-11-05', NULL, 'Dr. James Green', 'Epilepsy maintenance dose.'),
(3, 'Propranolol', '10 mg', 'Once daily', '2025-11-07', '2025-12-07', 'Dr. James Green', 'For heart murmur management.'),
(4, 'Ibuprofen', '100 mg', 'Three times daily', '2025-11-10', '2025-11-20', 'Dr. James Green', 'Post-surgery pain relief.'),
(5, 'Furosemide', '20 mg', 'Once daily', '2025-11-01', NULL, 'Dr. James Green', 'For congenital heart condition.'),
(6, 'Paracetamol', '250 mg', 'Every 6 hours', '2025-11-08', '2025-11-18', 'Dr. Ethan Jones', 'Pain relief during physiotherapy.'),
(7, 'Methotrexate', '5 mg', 'Weekly', '2025-11-01', NULL, 'Dr. Chloe Patel', 'Leukemia treatment.'),
(8, 'Mesalazine', '500 mg', 'Three times daily', '2025-11-03', NULL, 'Dr. Daniel Wilson', 'Ulcerative colitis maintenance.'),
(9, 'Amoxicillin', '250 mg', 'Three times daily', '2025-11-10', '2025-11-17', 'Dr. Ethan Jones', 'Post-fracture infection prevention.'),
(10, 'Cetirizine', '10 mg', 'Once daily', '2025-11-05', '2025-12-05', 'Dr. Sarah Smith', 'For food allergy symptom control.'),
(11, 'Sumatriptan', '50 mg', 'As needed', '2025-11-01', NULL, 'Dr. Olivia White', 'Migraine management.'),
(12, 'Diclofenac', '25 mg', 'Twice daily', '2025-11-06', '2025-11-20', 'Dr. Ethan Jones', 'Sports injury pain control.');
