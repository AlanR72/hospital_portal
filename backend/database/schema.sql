-- ==========================================================
-- Hospital Portal Database Schema (Cleaned & Commented)
-- Author: Alan
-- ==========================================================

-- Drop the old database if it exists
DROP DATABASE IF EXISTS hospital_portal;

-- Create database and select it
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

-- Sample medical team members
INSERT INTO medical_team (name, role, department, contact_email, contact_phone, profile_notes)
VALUES
('Dr. Sarah Smith', 'Doctor', 'Pediatrics', '[sarah.smith@hospital.org](mailto:sarah.smith@hospital.org)', '01234 111222', 'Specialist in childhood respiratory conditions.'),
('Nurse Emma Brown', 'Nurse', 'Outpatient Care', '[emma.brown@hospital.org](mailto:emma.brown@hospital.org)', '01234 333444', 'Provides follow-up and aftercare support.'),
('Dr. James Green', 'Specialist', 'Cardiology', '[james.green@hospital.org](mailto:james.green@hospital.org)', '01234 555666', 'Focuses on pediatric heart health.'),
('Dr. Olivia White', 'Doctor', 'Neurology', '[olivia.white@hospital.org](mailto:olivia.white@hospital.org)', '01234 777888', 'Specializes in pediatric neurological disorders.'),
('Dr. Chloe Patel', 'Doctor', 'Oncology', '[chloe.patel@hospital.org](mailto:chloe.patel@hospital.org)', '01234 222333', 'Expert in childhood cancer treatments.'),
('Dr. Ethan Jones', 'Doctor', 'Orthopedics', '[ethan.jones@hospital.org](mailto:ethan.jones@hospital.org)', '01234 666777', 'Treats bone and joint conditions in children.'),
('Dr. Daniel Wilson', 'Doctor', 'Gastroenterology', '[daniel.wilson@hospital.org](mailto:daniel.wilson@hospital.org)', '01234 121314', 'Specialist in pediatric digestive health.'),
('Nurse Liam Turner', 'Nurse', 'Intensive Care', '[liam.turner@hospital.org](mailto:liam.turner@hospital.org)', '01234 999000', 'Experienced in critical care for young patients.'),
('Nurse Sophie Clark', 'Nurse', 'Emergency', '[sophie.clark@hospital.org](mailto:sophie.clark@hospital.org)', '01234 444555', 'Works in emergency response and triage.'),
('Nurse Ava Martin', 'Nurse', 'Cardiology', '[ava.martin@hospital.org](mailto:ava.martin@hospital.org)', '01234 888999', 'Supports cardiac patients and post-surgery care.');

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

-- Sample patients
INSERT INTO patients (first_name, last_name, dob, gender, address, contact_phone, guardian_id, notes)
VALUES
('Emily','Johnson','2022-06-15','Female','12 Oak Street, Glasgow','07891 223344',NULL,'Asthma – regular check-ups with Dr. Sarah Smith.'),
('Mia','Patel','2022-08-10','Female','9 Willow Crescent, Paisley','07891 445566',NULL,'Epilepsy – managed with medication.'),
('Sophia','White','2022-04-05','Female','19 Pine Close, Glasgow','07891 889900',NULL,'Heart murmur – monitored by Dr. James Green.'),
('Grace','Lewis','2023-01-20','Female','8 Cedar Grove, Glasgow','07891 333444',NULL,'Post-surgery recovery – supervised by Dr. James Green.'),
('Liam','Brown','2014-06-15','Male','45 Maple Avenue, Glasgow','07891 334455',NULL,'Congenital heart defect – under care of Dr. James Green.'),
('Noah','Wilson','2014-05-20','Male','33 Birch Lane, East Kilbride','07891 556677',NULL,'Recovering from a broken leg – physiotherapy ongoing.'),
('Ava','Thompson','2015-05-18','Female','21 Cherry Road, Glasgow','07891 667788',NULL,'Leukemia – ongoing treatment with Dr. Chloe Patel.'),
('Oliver','Evans','2015-09-04','Male','88 Spruce Street, Hamilton','07891 778899',NULL,'Ulcerative colitis – monitored by Dr. Daniel Wilson.'),
('Benjamin','Hall','2014-08-30','Male','4 Hawthorn Drive, Glasgow','07891 990011',NULL,'Fractured arm – follow-up with Dr. Ethan Jones.'),
('Lucas','Scott','2015-06-11','Male','15 Poplar Street, Glasgow','07891 222333',NULL,'Food allergies – advised by Dr. Sarah Smith.'),
('Isabella','King','2014-12-15','Female','62 Rowan Way, Glasgow','07891 111222',NULL,'Chronic migraines – under review by Dr. Olivia White.'),
('Jacob','Moore','2015-03-19','Male','27 Elm Road, Glasgow','07891 444555',NULL,'Sports injury – attending rehab with Dr. Ethan Jones.');

-- ==========================================================
-- 3. USERS TABLE
-- ==========================================================
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(100) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
role ENUM('patient','parent','doctor','nurse','admin') NOT NULL DEFAULT 'patient',
patient_id INT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_patient_user FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Insert staff and patient accounts
INSERT INTO users (username, password_hash, role, patient_id)
VALUES
-- Staff
('dr_smith','Password123!','doctor',NULL),
('nurse_brown','Password123!','nurse',NULL),
('dr_green','Password123!','doctor',NULL),
('dr_white','Password123!','doctor',NULL),
('dr_patel','Password123!','doctor',NULL),
('dr_jones','Password123!','doctor',NULL),
-- Patients
('emily_johnson','Password123!','patient',1),
('mia_patel','Password123!','patient',2),
('sophia_white','Password123!','patient',3),
('grace_lewis','Password123!','patient',4),
('liam_brown','Password123!','patient',5),
('noah_wilson','Password123!','patient',6),
('ava_thompson','Password123!','patient',7),
('oliver_evans','Password123!','patient',8),
('benjamin_hall','Password123!','patient',9),
('lucas_scott','Password123!','patient',10),
('isabella_king','Password123!','patient',11),
('jacob_moore','Password123!','patient',12);

-- ==========================================================
-- 4. PARENT-CHILD RELATIONSHIP
-- ==========================================================
-- Parent accounts are created based on patient last_name + random first names
INSERT INTO users (username, password_hash, role)
SELECT
CONCAT(
ELT(FLOOR(1 + RAND() * 10),
'Liam','Josh','Oliver','James','Emma',
'Olivia','Louise','Mia','Sophia','Amelia'
),
'*',
LOWER(p.last_name),
'*',
p.id
) AS username,
'Password123!' AS password_hash,
'parent' AS role
FROM patients p;

-- Table to link parents to patients
CREATE TABLE parent_child (
id INT AUTO_INCREMENT PRIMARY KEY,
parent_user_id INT NOT NULL,
patient_id INT NOT NULL,
relationship VARCHAR(50) DEFAULT 'parent',
FOREIGN KEY (parent_user_id) REFERENCES users(id),
FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Populate parent_child by linking parent accounts to patient ID extracted from username
INSERT INTO parent_child (parent_user_id, patient_id)
SELECT
u.id AS parent_user_id,
CAST(SUBSTRING_INDEX(u.username, '*', -1) AS UNSIGNED) AS patient_id
FROM users u
JOIN patients p
ON p.id = CAST(SUBSTRING_INDEX(u.username, '*', -1) AS UNSIGNED)
WHERE u.role = 'parent';

-- ==========================================================
-- 5. PATIENT TEAM
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
FOREIGN KEY (team_member_id) REFERENCES medical_team(id)
);

-- Note: Populated automatically based on medicines and assigned doctors
-- (Population query can be run separately as needed)

-- ==========================================================
-- 6. APPOINTMENTS TABLE
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
CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES medical_team(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==========================================================
-- 7. MEDICINES TABLE
-- ==========================================================
CREATE TABLE medicines (
id INT AUTO_INCREMENT PRIMARY KEY,
patient_id INT NOT NULL,
medicine_name VARCHAR(100) NOT NULL,
dosage VARCHAR(50) NOT NULL,
frequency VARCHAR(100) NOT NULL,
start_date DATE NOT NULL,
end_date DATE DEFAULT NULL,
prescribed_by VARCHAR(100),
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_medicine_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ==========================================================
-- Sample inserts for appointments, medicines, etc.
-- Populate as needed for development or testing
-- ==========================================================
