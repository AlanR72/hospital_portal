-- ============================================
-- Hospital Portal Database Schema (Fresh Start)
-- Author: Alan
-- ============================================

-- Drop old database if exists
DROP DATABASE IF EXISTS hospital_portal;

-- Create database
CREATE DATABASE hospital_portal;
USE hospital_portal;

-- =========================
-- 1. MEDICAL TEAM TABLE
-- =========================
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

-- Insert medical team
INSERT INTO medical_team (name, role, department, contact_email, contact_phone, profile_notes)
VALUES
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

-- =========================
-- 2. PATIENTS TABLE
-- =========================
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

-- Insert 12 patients with correct ages for 2025
INSERT INTO patients (first_name, last_name, dob, gender, address, contact_phone, guardian_id, notes)
VALUES
-- 2-4 year olds (2021-11-13 → 2023-11-13)
('Emily','Johnson','2022-06-15','Female','12 Oak Street, Glasgow','07891 223344',NULL,'Asthma – regular check-ups with Dr. Sarah Smith.'),
('Mia','Patel','2022-08-10','Female','9 Willow Crescent, Paisley','07891 445566',NULL,'Epilepsy – managed with medication.'),
('Sophia','White','2022-04-05','Female','19 Pine Close, Glasgow','07891 889900',NULL,'Heart murmur – monitored by Dr. James Green.'),
('Grace','Lewis','2023-01-20','Female','8 Cedar Grove, Glasgow','07891 333444',NULL,'Post-surgery recovery – supervised by Dr. James Green.'),

-- 9-12 year olds (2013-11-13 → 2016-11-13)
('Liam','Brown','2014-06-15','Male','45 Maple Avenue, Glasgow','07891 334455',NULL,'Congenital heart defect – under care of Dr. James Green.'),
('Noah','Wilson','2014-05-20','Male','33 Birch Lane, East Kilbride','07891 556677',NULL,'Recovering from a broken leg – physiotherapy ongoing.'),
('Ava','Thompson','2015-05-18','Female','21 Cherry Road, Glasgow','07891 667788',NULL,'Leukemia – ongoing treatment with Dr. Chloe Patel.'),
('Oliver','Evans','2015-09-04','Male','88 Spruce Street, Hamilton','07891 778899',NULL,'Ulcerative colitis – monitored by Dr. Daniel Wilson.'),
('Benjamin','Hall','2014-08-30','Male','4 Hawthorn Drive, Glasgow','07891 990011',NULL,'Fractured arm – follow-up with Dr. Ethan Jones.'),
('Lucas','Scott','2015-06-11','Male','15 Poplar Street, Glasgow','07891 222333',NULL,'Food allergies – advised by Dr. Sarah Smith.'),
('Isabella','King','2014-12-15','Female','62 Rowan Way, Glasgow','07891 111222',NULL,'Chronic migraines – under review by Dr. Olivia White.'),
('Jacob','Moore','2015-03-19','Male','27 Elm Road, Glasgow','07891 444555',NULL,'Sports injury – attending rehab with Dr. Ethan Jones.');

-- =========================
-- 3. USERS TABLE
-- =========================
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

-- Insert users for patients, parents, and staff (all passwords: Password123!)
INSERT INTO users (username, password_hash, role, patient_id)
VALUES
-- Parents (guardian accounts)
('john_johnson','Password123!','parent',NULL),
('rachel_brown','Password123!','parent',NULL),
('anita_patel','Password123!','parent',NULL),
('mark_wilson','Password123!','parent',NULL),

-- Staff accounts
('dr_smith','Password123!','doctor',NULL),
('nurse_brown','Password123!','nurse',NULL),
('dr_green','Password123!','doctor',NULL),
('dr_white','Password123!','doctor',NULL),
('dr_patel','Password123!','doctor',NULL),
('dr_jones','Password123!','doctor',NULL),

-- Patient accounts
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

-- =========================
-- 4. PATIENT_TEAM TABLE
-- =========================
CREATE TABLE patient_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    team_member_id INT NOT NULL,
    relationship VARCHAR(50),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pt_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pt_team FOREIGN KEY (team_member_id) REFERENCES medical_team(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Link patients to doctors/nurses
INSERT INTO patient_team (patient_id, team_member_id, relationship, notes)
VALUES
(1,1,'Primary Doctor','Asthma care'),
(2,3,'Cardiologist','Heart condition'),
(3,4,'Neurologist','Epilepsy management'),
(4,6,'Orthopedic Doctor','Fracture rehab'),
(5,5,'Oncologist','Chemotherapy treatment'),
(6,7,'Gastroenterologist','Ulcerative colitis monitoring'),
(7,3,'Cardiologist','Heart murmur follow-up'),
(8,6,'Orthopedic Doctor','Arm recovery'),
(9,3,'Cardiologist','Fractured arm follow-up'),
(10,1,'Primary Doctor','Allergy management'),
(11,4,'Neurologist','Migraine management'),
(12,6,'Orthopedic Doctor','Sports injury rehab');

-- =========================
-- 5. APPOINTMENTS TABLE
-- =========================
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

-- Insert appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, location, purpose, status, notes)
VALUES
(1,1,'2025-03-20 10:30:00','Room 201 - Pediatrics','Asthma review','completed','Condition stable'),
(2,3,'2025-05-18 14:00:00','Room 304 - Cardiology','Heart check-up','completed','Improved condition'),
(3,4,'2025-10-01 09:15:00','Room 220 - Neurology','Epilepsy consultation','upcoming','EEG test scheduled'),
(4,6,'2025-02-12 11:00:00','Orthopedics Ward','Leg physiotherapy','completed','Excellent recovery'),
(5,5,'2025-11-15 13:30:00','Oncology Suite','Chemotherapy session','upcoming','Continue treatment plan'),
(6,7,'2025-09-10 10:00:00','Room 412 - Gastroenterology','Ulcerative colitis review','completed','Medication adjusted'),
(7,3,'2025-11-10 15:30:00','Cardiology Wing','Heart murmur follow-up','upcoming','Check ECG readings'),
(8,6,'2025-06-20 09:45:00','Orthopedics Ward','Arm check-up','completed','Full mobility restored'),
(9,3,'2025-10-22 10:30:00','Cardiology Clinic','Fractured arm follow-up','completed','Recovery proceeding well'),
(10,1,'2025-07-05 14:45:00','Pediatrics Wing','Allergy test','completed','Nut sensitivity identified'),
(11,4,'2025-12-02 11:15:00','Neurology Clinic','Migraine management','upcoming','Adjust medication'),
(12,6,'2025-08-30 13:00:00','Physio Room 2','Sports injury rehab','completed','Cleared for light activity');

-- =========================
-- 6. MEDICINES TABLE
-- =========================
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

-- Insert medicines
INSERT INTO medicines (patient_id, medicine_name, dosage, frequency, start_date, end_date, prescribed_by, notes)
VALUES
(1,'Salbutamol Inhaler','2 puffs','As needed','2025-01-10',NULL,'Dr. Sarah Smith','Asthma control'),
(2,'Atenolol','25mg','Once daily','2024-12-01',NULL,'Dr. James Green','Heart condition management'),
(3,'Levetiracetam','250mg','Twice daily','2025-03-05',NULL,'Dr. Olivia White','Epilepsy treatment'),
(4,'Paracetamol','500mg','Every 6 hours','2025-02-15','2025-03-01','Dr. Ethan Jones','Pain relief post-fracture'),
(5,'Methotrexate','10mg','Weekly','2025-06-01',NULL,'Dr. Chloe Patel','Chemotherapy maintenance'),
(6,'Mesalazine','500mg','Three times daily','2024-11-20',NULL,'Dr. Daniel Wilson','Ulcerative colitis'),
(7,'Propranolol','10mg','Twice daily','2025-09-10',NULL,'Dr. James Green','Heart murmur control'),
(8,'Ibuprofen','200mg','Every 8 hours','2025-06-05','2025-06-15','Dr. Ethan Jones','Pain management'),
(9,'Amitriptyline','10mg','Nightly','2025-10-20',NULL,'Dr. Olivia White','Chronic migraine management'),
(10,'Cetirizine','10mg','Once daily','2025-07-10',NULL,'Dr. Sarah Smith','Allergy prevention'),
(11,'Furosemide','20mg','Once daily','2025-04-01',NULL,'Dr. James Green','Heart surgery recovery'),
(12,'Diclofenac Gel','2g','Twice daily','2025-03-25','2025-04-10','Dr. Ethan Jones','Sports injury inflammation');