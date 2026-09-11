# BACSE344 - Cloud Infrastructure and Architecture
## Comprehensive Database Engineering & Advanced SQL Implementation Report
### CloudMed: Enterprise Healthcare & Appointment Management System

> [!IMPORTANT]
> **Course Code**: BACSE344 - Cloud Infrastructure and Architecture  
> **Slot**: C1 Slot  
> **Faculty**: Dr. P. Anandan  
> **Topic**: Advanced Relational Database Design, SQL Query Optimization, Stored Routines & Transactional Integrity  
> **Target Database Engine**: PostgreSQL 15+ / MySQL 8.0 / Cloud PostgreSQL (Supabase / Railway)  
> **Repository**: [https://github.com/cain32155/cloudmed-bacse344](https://github.com/cain32155/cloudmed-bacse344)  

---

## 📑 Table of Contents
1. [Database Creation & Schema Initialization](#1-database-creation--schema-initialization)
2. [Table Definitions, Data Types & Integrity Constraints](#2-table-definitions-data-types--integrity-constraints)
3. [Primary & Foreign Keys Specification](#3-primary--foreign-keys-specification)
4. [Data Insertion Using Real-World Healthcare Datasets](#4-data-insertion-using-real-world-healthcare-datasets)
5. [Complete CRUD Operations Implementation](#5-complete-crud-operations-implementation)
6. [SQL Commands Classification (DDL, DML, DQL, DCL, TCL)](#6-sql-commands-classification)
7. [Advanced Relational Joins](#7-advanced-relational-joins)
8. [Nested & Correlated Subqueries](#8-nested--correlated-subqueries)
9. [Aggregate Functions & Analytical Grouping](#9-aggregate-functions--analytical-grouping)
10. [Database Views (Virtual Tables)](#10-database-views-virtual-tables)
11. [Stored Procedures with Parameter Modes](#11-stored-procedures-with-parameter-modes)
12. [User-Defined Functions (UDFs)](#12-user-defined-functions-udfs)
13. [Active Database Triggers & Audit Logging](#13-active-database-triggers--audit-logging)
14. [Database Cursors & Batch Row Processing](#14-database-cursors--batch-row-processing)
15. [ACID Transactions (COMMIT, ROLLBACK, SAVEPOINT)](#15-acid-transactions-commit-rollback-savepoint)
16. [Comprehensive Verification & Testing Suite](#16-comprehensive-verification--testing-suite)

---

## 1. Database Creation & Schema Initialization

### 1.1 Database Provisioning Script
The database initializes a dedicated transactional catalog `cloudmed_db` with UTF-8 character encoding and case-insensitive collation.

```sql
-- Step 1: Drop existing database if required for clean deployment
DROP DATABASE IF EXISTS cloudmed_db;

-- Step 2: Create new enterprise healthcare database
CREATE DATABASE cloudmed_db
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

-- Step 3: Connect to the target database
\c cloudmed_db;

-- Step 4: Create dedicated schema for isolation
CREATE SCHEMA IF NOT EXISTS clinical_core;
SET search_path TO clinical_core, public;
```

---

## 2. Table Definitions, Data Types & Integrity Constraints

The schema models 5 core clinical domain entities:
1. `departments` (Hospital Medical Divisions)
2. `doctors` (Physicians & Specialists)
3. `patients` (Patient Medical Profiles)
4. `appointments` (Consultation Bookings)
5. `audit_logs` (Security & Transaction History)

### 2.1 Complete DDL Script with Constraints

```sql
-- 1. Departments Table
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    head_physician VARCHAR(100),
    building_block VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_dept_name_min_len CHECK (LENGTH(dept_name) >= 3)
);

-- 2. Doctors Table
CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    dept_id INT NOT NULL,
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    available_days VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_consultation_fee CHECK (consultation_fee >= 0),
    CONSTRAINT chk_doctor_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT fk_doctor_dept FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 3. Patients Table
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(15) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    medical_history TEXT,
    emergency_contact VARCHAR(20),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_patient_age CHECK (age BETWEEN 0 AND 125),
    CONSTRAINT chk_patient_gender CHECK (gender IN ('Male', 'Female', 'Other')),
    CONSTRAINT chk_patient_blood_group CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    CONSTRAINT chk_patient_phone CHECK (LENGTH(phone) >= 7)
);

-- 4. Appointments Table
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
    notes TEXT,
    billing_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_appointment_status CHECK (status IN ('Scheduled', 'In-Progress', 'Completed', 'Cancelled', 'No-Show')),
    CONSTRAINT chk_billing_amount CHECK (billing_amount >= 0),
    CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 5. Audit Log Table
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    entity_name VARCHAR(50) NOT NULL,
    operation_type VARCHAR(20) NOT NULL,
    entity_id INT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    performed_by VARCHAR(50) DEFAULT CURRENT_USER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Primary & Foreign Keys Specification

### 3.1 Key Mapping Matrix

| Table Name | Primary Key | Foreign Key Column | Referenced Table (Target PK) | On Delete | On Update |
|---|---|---|---|---|---|
| `departments` | `dept_id` | *None* | *None* | - | - |
| `doctors` | `doctor_id` | `dept_id` | `departments(dept_id)` | `RESTRICT` | `CASCADE` |
| `patients` | `patient_id` | *None* | *None* | - | - |
| `appointments` | `appointment_id` | `patient_id` | `patients(patient_id)` | `CASCADE` | `CASCADE` |
| `appointments` | `appointment_id` | `doctor_id` | `doctors(doctor_id)` | `RESTRICT` | `CASCADE` |
| `audit_logs` | `log_id` | *None* | *None* | - | - |

---

## 4. Data Insertion Using Real-World Healthcare Datasets

### 4.1 Master Data Insertion Script

```sql
-- 1. Insert Departments
INSERT INTO departments (dept_name, head_physician, building_block, emergency_contact) VALUES
('Cardiology', 'Dr. Sarah Jenkins', 'Block A - 3rd Floor', '+1-555-0101'),
('Neurology', 'Dr. Rajesh Patel', 'Block B - 2nd Floor', '+1-555-0102'),
('Pediatrics', 'Dr. Elena Rostova', 'Block C - 1st Floor', '+1-555-0103'),
('Orthopedics', 'Dr. Marcus Vance', 'Block A - 1st Floor', '+1-555-0104'),
('Dermatology', 'Dr. Chloe Adams', 'Block D - 4th Floor', '+1-555-0105');

-- 2. Insert Doctors
INSERT INTO doctors (name, specialty, email, phone, dept_id, consultation_fee, available_days) VALUES
('Dr. Sarah Jenkins', 'Interventional Cardiology', 'sarah.jenkins@cloudmed.io', '+1-555-0201', 1, 850.00, 'Mon, Wed, Fri'),
('Dr. Rajesh Patel', 'Clinical Neurology', 'rajesh.patel@cloudmed.io', '+1-555-0202', 2, 900.00, 'Tue, Thu, Sat'),
('Dr. Elena Rostova', 'Pediatric Medicine', 'elena.rostova@cloudmed.io', '+1-555-0203', 3, 600.00, 'Mon, Tue, Wed, Thu'),
('Dr. Marcus Vance', 'Orthopedic Surgery', 'marcus.vance@cloudmed.io', '+1-555-0204', 4, 750.00, 'Wed, Thu, Fri, Sat'),
('Dr. Chloe Adams', 'Cosmetic Dermatology', 'chloe.adams@cloudmed.io', '+1-555-0205', 5, 500.00, 'Mon, Tue, Fri');

-- 3. Insert Patients
INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history, emergency_contact) VALUES
('Alice Johnson', 34, 'Female', 'O+', '+1-555-0301', 'alice.johnson@example.com', '742 Evergreen Terrace, Springfield', 'Mild hypertension, penicillin allergy', '+1-555-0901'),
('Robert Martinez', 52, 'Male', 'A+', '+1-555-0302', 'robert.martinez@example.com', '124 Conch Street, Bikini Bottom', 'Type 2 diabetes, previous knee arthroscopy', '+1-555-0902'),
('Emily Chen', 28, 'Female', 'B-', '+1-555-0303', 'emily.chen@example.com', '432 Elm Street, Metropolis', 'Asthma (albuterol inhaler prescribed)', '+1-555-0903'),
('David Kim', 45, 'Male', 'AB+', '+1-555-0304', 'david.kim@example.com', '888 Maple Avenue, Gotham', 'No significant prior medical history', '+1-555-0904'),
('Sophia Taylor', 61, 'Female', 'O-', '+1-555-0305', 'sophia.taylor@example.com', '910 Pine Crest Blvd, Star City', 'Coronary artery disease, high cholesterol', '+1-555-0905'),
('Michael Brown', 19, 'Male', 'A-', '+1-555-0306', 'michael.brown@example.com', '15 Baker Street, Central City', 'Sports injury - right shoulder tendonitis', '+1-555-0906');

-- 4. Insert Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status, notes, billing_amount, is_paid) VALUES
(1, 1, '2026-09-15', '09:30 AM', 'Annual Cardiac Checkup', 'Completed', 'ECG normal. Blood pressure 120/80. Prescribed diet control.', 850.00, TRUE),
(2, 4, '2026-09-15', '10:30 AM', 'Knee Joint Pain Review', 'Completed', 'Administered hyaluronic acid injection. Physical therapy advised.', 750.00, TRUE),
(3, 3, '2026-09-16', '11:15 AM', 'Pediatric Wellness Consultation', 'Scheduled', 'Routine checkup and booster vaccination.', 600.00, FALSE),
(4, 2, '2026-09-16', '02:00 PM', 'Chronic Migraine Assessment', 'Scheduled', 'MRI report review scheduled.', 900.00, FALSE),
(5, 1, '2026-09-17', '03:30 PM', 'Coronary Stent Follow-up', 'Scheduled', 'Check lipid profile and stress echocardiogram.', 850.00, FALSE),
(6, 5, '2026-09-17', '04:30 PM', 'Eczema Flare-up Consultation', 'Cancelled', 'Patient requested rescheduling due to travel.', 0.00, FALSE);
```

---

## 5. Complete CRUD Operations Implementation

```sql
-- =========================================================================
-- 1. CREATE (Insert New Entity Records)
-- =========================================================================
INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history)
VALUES ('Rishi Kumar', 24, 'Male', 'B+', '+1-555-0399', 'rishi.kumar@cloudmed.io', '34 Techno Park, Chennai', 'None');

INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status, billing_amount)
VALUES (7, 1, '2026-09-20', '10:00 AM', 'Cardiology Health Screening', 'Scheduled', 850.00);

-- =========================================================================
-- 2. READ (Retrieve with Projections, Predicates & Sorting)
-- =========================================================================
SELECT 
    a.appointment_id,
    p.name AS patient_name,
    p.blood_group,
    d.name AS doctor_name,
    d.specialty,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.billing_amount
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN doctors d ON a.doctor_id = d.doctor_id
WHERE a.status = 'Scheduled'
ORDER BY a.appointment_date ASC, a.appointment_time ASC;

-- =========================================================================
-- 3. UPDATE (Modify Existing State)
-- =========================================================================
UPDATE appointments
SET 
    status = 'Completed',
    notes = 'Screening successfully performed. All vitals in optimal range.',
    is_paid = TRUE
WHERE appointment_id = 7;

-- =========================================================================
-- 4. DELETE (Remove Record with Referential Integrity)
-- =========================================================================
DELETE FROM appointments
WHERE appointment_id = 6 AND status = 'Cancelled';
```

---

## 6. SQL Commands Classification

```sql
-- DDL (Data Definition Language)
ALTER TABLE patients ADD COLUMN date_of_birth DATE;
CREATE INDEX idx_appointments_date_status ON appointments (appointment_date, status);

-- DML (Data Manipulation Language)
UPDATE doctors SET consultation_fee = consultation_fee * 1.05 WHERE dept_id = 1;

-- DQL (Data Query Language)
SELECT name, email, phone FROM doctors WHERE is_active = TRUE;

-- DCL (Data Control Language)
CREATE ROLE clinic_receptionist;
GRANT SELECT, INSERT, UPDATE ON appointments, patients TO clinic_receptionist;
REVOKE DELETE ON patients FROM clinic_receptionist;

-- TCL (Transaction Control Language)
BEGIN;
UPDATE appointments SET is_paid = TRUE WHERE appointment_id = 3;
COMMIT;
```

---

## 7. Advanced Relational Joins

### 7.1 INNER JOIN: Appointments with Doctor & Patient Details
```sql
SELECT 
    a.appointment_id,
    p.name AS patient_name,
    p.phone AS patient_phone,
    d.name AS doctor_name,
    d.specialty,
    dept.dept_name,
    a.appointment_date,
    a.appointment_time,
    a.status
FROM appointments a
INNER JOIN patients p ON a.patient_id = p.patient_id
INNER JOIN doctors d ON a.doctor_id = d.doctor_id
INNER JOIN departments dept ON d.dept_id = dept.dept_id;
```

### 7.2 LEFT OUTER JOIN: All Patients with Appointment Counts
```sql
SELECT 
    p.patient_id,
    p.name AS patient_name,
    p.blood_group,
    COUNT(a.appointment_id) AS total_appointments_booked,
    COALESCE(SUM(a.billing_amount), 0.00) AS total_revenue_generated
FROM patients p
LEFT JOIN appointments a ON p.patient_id = a.patient_id
GROUP BY p.patient_id, p.name, p.blood_group
ORDER BY total_appointments_booked DESC;
```

### 7.3 RIGHT OUTER JOIN: Departments and Registered Doctors
```sql
SELECT 
    dept.dept_name,
    dept.building_block,
    d.name AS doctor_name,
    d.specialty,
    d.consultation_fee
FROM doctors d
RIGHT JOIN departments dept ON d.dept_id = dept.dept_id
ORDER BY dept.dept_name;
```

### 7.4 FULL OUTER JOIN: Reconciling Doctors and Patient Consultation Matrices
```sql
SELECT 
    COALESCE(d.name, 'Unassigned Doctor') AS doctor_name,
    COALESCE(p.name, 'No Patient Scheduled') AS patient_name,
    a.appointment_date,
    a.status
FROM doctors d
FULL OUTER JOIN appointments a ON d.doctor_id = a.doctor_id
FULL OUTER JOIN patients p ON a.patient_id = p.patient_id;
```

### 7.5 CROSS JOIN: Department Slot Availability Matrix
```sql
SELECT 
    d.dept_name,
    t.time_slot
FROM departments d
CROSS JOIN (
    VALUES ('09:00 AM'), ('10:00 AM'), ('11:00 AM'), ('02:00 PM'), ('03:00 PM'), ('04:00 PM')
) AS t(time_slot)
ORDER BY d.dept_name, t.time_slot;
```

### 7.6 SELF JOIN: Finding Patients from the Same City / Address
```sql
SELECT 
    A.name AS patient_one,
    B.name AS patient_two,
    A.address AS shared_address
FROM patients A
JOIN patients B ON A.address = B.address AND A.patient_id < B.patient_id;
```

---

## 8. Nested & Correlated Subqueries

### 8.1 Single-Row Subquery: Doctors Charging Above Average Fee
```sql
SELECT 
    name,
    specialty,
    consultation_fee
FROM doctors
WHERE consultation_fee > (
    SELECT AVG(consultation_fee) FROM doctors
);
```

### 8.2 Multi-Row Subquery (IN / EXISTS): Patients with Multiple Visits
```sql
SELECT 
    patient_id,
    name,
    email,
    phone
FROM patients
WHERE patient_id IN (
    SELECT patient_id 
    FROM appointments 
    GROUP BY patient_id 
    HAVING COUNT(appointment_id) >= 1
);
```

### 8.3 Correlated Subquery: Latest Appointment for Every Patient
```sql
SELECT 
    p.patient_id,
    p.name,
    a.appointment_date,
    a.reason,
    a.status
FROM patients p
JOIN appointments a ON p.patient_id = a.patient_id
WHERE a.appointment_date = (
    SELECT MAX(sub_a.appointment_date)
    FROM appointments sub_a
    WHERE sub_a.patient_id = p.patient_id
);
```

### 8.4 Subquery in FROM Clause (Derived Table)
```sql
SELECT 
    dept_name,
    doctor_count,
    avg_department_fee
FROM (
    SELECT 
        dept.dept_name,
        COUNT(d.doctor_id) AS doctor_count,
        ROUND(AVG(d.consultation_fee), 2) AS avg_department_fee
    FROM departments dept
    JOIN doctors d ON dept.dept_id = d.dept_id
    GROUP BY dept.dept_name
) AS dept_summary
WHERE doctor_count >= 1;
```

---

## 9. Aggregate Functions & Analytical Grouping

```sql
SELECT 
    d.department AS department_name,
    COUNT(a.appointment_id) AS total_appointments,
    COUNT(CASE WHEN a.status = 'Completed' THEN 1 END) AS completed_appointments,
    COUNT(CASE WHEN a.status = 'Cancelled' THEN 1 END) AS cancelled_appointments,
    MIN(a.billing_amount) AS min_charge,
    MAX(a.billing_amount) AS max_charge,
    ROUND(AVG(a.billing_amount), 2) AS avg_bill_amount,
    SUM(a.billing_amount) AS total_revenue
FROM appointments a
JOIN doctors doc ON a.doctor_id = doc.doctor_id
JOIN departments d ON doc.dept_id = d.dept_id
GROUP BY d.department
HAVING COUNT(a.appointment_id) > 0
ORDER BY total_revenue DESC;
```

---

## 10. Database Views (Virtual Tables)

### 10.1 View 1: `vw_active_appointments` (Operational View)
```sql
CREATE OR REPLACE VIEW vw_active_appointments AS
SELECT 
    a.appointment_id,
    p.name AS patient_name,
    p.phone AS patient_contact,
    p.blood_group,
    d.name AS doctor_name,
    d.specialty,
    dept.dept_name AS department,
    a.appointment_date,
    a.appointment_time,
    a.reason,
    a.status,
    a.billing_amount,
    a.is_paid
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN doctors d ON a.doctor_id = d.doctor_id
JOIN departments dept ON d.dept_id = dept.dept_id
WHERE a.status IN ('Scheduled', 'In-Progress');
```

### 10.2 View 2: `vw_doctor_performance` (Analytical View)
```sql
CREATE OR REPLACE VIEW vw_doctor_performance AS
SELECT 
    d.doctor_id,
    d.name AS doctor_name,
    d.specialty,
    dept.dept_name,
    COUNT(a.appointment_id) AS total_consultations,
    SUM(CASE WHEN a.is_paid = TRUE THEN a.billing_amount ELSE 0 END) AS collected_revenue,
    ROUND(AVG(CASE WHEN a.status = 'Completed' THEN a.billing_amount ELSE NULL END), 2) AS avg_consultation_revenue
FROM doctors d
JOIN departments dept ON d.dept_id = dept.dept_id
LEFT JOIN appointments a ON d.doctor_id = a.doctor_id
GROUP BY d.doctor_id, d.name, d.specialty, dept.dept_name;
```

---

## 11. Stored Procedures with Parameter Modes

### 11.1 Procedure: `sp_book_appointment` (Transactional Booking with Validation)

```sql
CREATE OR REPLACE PROCEDURE sp_book_appointment(
    IN p_patient_id INT,
    IN p_doctor_id INT,
    IN p_appointment_date DATE,
    IN p_appointment_time VARCHAR(20),
    IN p_reason VARCHAR(255),
    OUT p_appointment_id INT,
    OUT p_status_message VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_doctor_fee NUMERIC(10, 2);
    v_conflict_count INT;
BEGIN
    -- Check if patient exists
    IF NOT EXISTS (SELECT 1 FROM patients WHERE patient_id = p_patient_id) THEN
        p_status_message := 'Error: Patient ID does not exist.';
        RETURN;
    END IF;

    -- Check if doctor exists and is active
    SELECT consultation_fee INTO v_doctor_fee 
    FROM doctors 
    WHERE doctor_id = p_doctor_id AND is_active = TRUE;

    IF NOT FOUND THEN
        p_status_message := 'Error: Doctor is either inactive or does not exist.';
        RETURN;
    END IF;

    -- Check for double booking conflict
    SELECT COUNT(*) INTO v_conflict_count
    FROM appointments
    WHERE doctor_id = p_doctor_id 
      AND appointment_date = p_appointment_date 
      AND appointment_time = p_appointment_time
      AND status NOT IN ('Cancelled', 'No-Show');

    IF v_conflict_count > 0 THEN
        p_status_message := 'Error: Doctor is already booked for this date and time slot.';
        RETURN;
    END IF;

    -- Insert appointment record
    INSERT INTO appointments (
        patient_id, doctor_id, appointment_date, appointment_time, 
        reason, status, billing_amount, is_paid
    ) VALUES (
        p_patient_id, p_doctor_id, p_appointment_date, p_appointment_time, 
        p_reason, 'Scheduled', v_doctor_fee, FALSE
    ) RETURNING appointment_id INTO p_appointment_id;

    p_status_message := 'Success: Appointment booked with ID ' || p_appointment_id;
END;
$$;
```

---

## 12. User-Defined Functions (UDFs)

### 12.1 Scalar Function: `fn_calculate_patient_age`
```sql
CREATE OR REPLACE FUNCTION fn_get_patient_risk_category(p_patient_id INT)
RETURNS VARCHAR(30)
LANGUAGE plpgsql
AS $$
DECLARE
    v_age INT;
    v_history TEXT;
    v_risk VARCHAR(30);
BEGIN
    SELECT age, COALESCE(medical_history, '') INTO v_age, v_history
    FROM patients
    WHERE patient_id = p_patient_id;

    IF NOT FOUND THEN
        RETURN 'Unknown Patient';
    END IF;

    IF v_age >= 60 OR v_history ILIKE '%coronary%' OR v_history ILIKE '%cardiac%' THEN
        v_risk := 'High Risk';
    ELSIF v_age >= 40 OR v_history ILIKE '%diabetes%' OR v_history ILIKE '%hypertension%' THEN
        v_risk := 'Moderate Risk';
    ELSE
        v_risk := 'Low Risk';
    END IF;

    RETURN v_risk;
END;
$$;
```

### 12.2 Table-Valued Function: `fn_get_doctor_schedule`
```sql
CREATE OR REPLACE FUNCTION fn_get_doctor_schedule(p_doctor_id INT, p_date DATE)
RETURNS TABLE (
    appointment_id INT,
    patient_name VARCHAR(100),
    appointment_time VARCHAR(20),
    reason VARCHAR(255),
    status VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.appointment_id,
        p.name,
        a.appointment_time,
        a.reason,
        a.status
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    WHERE a.doctor_id = p_doctor_id AND a.appointment_date = p_date
    ORDER BY a.appointment_time ASC;
END;
$$;
```

---

## 13. Active Database Triggers & Audit Logging

### 13.1 Audit Logging Trigger Function
```sql
CREATE OR REPLACE FUNCTION trg_fn_audit_appointments()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (entity_name, operation_type, entity_id, new_data)
        VALUES ('appointments', 'INSERT', NEW.appointment_id, to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (entity_name, operation_type, entity_id, old_data, new_data)
        VALUES ('appointments', 'UPDATE', NEW.appointment_id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (entity_name, operation_type, entity_id, old_data)
        VALUES ('appointments', 'DELETE', OLD.appointment_id, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Bind Trigger to Table
DROP TRIGGER IF EXISTS trg_appointments_audit ON appointments;
CREATE TRIGGER trg_appointments_audit
AFTER INSERT OR UPDATE OR DELETE ON appointments
FOR EACH ROW EXECUTE FUNCTION trg_fn_audit_appointments();
```

---

## 14. Database Cursors & Batch Row Processing

```sql
CREATE OR REPLACE PROCEDURE sp_process_monthly_billing_batch(
    IN p_billing_discount_rate NUMERIC(4, 2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    -- 1. Declare cursor for unpaid completed appointments
    cur_unpaid_appointments CURSOR FOR
        SELECT appointment_id, patient_id, billing_amount
        FROM appointments
        WHERE status = 'Completed' AND is_paid = FALSE;

    v_rec RECORD;
    v_updated_count INT := 0;
    v_discounted_amount NUMERIC(10, 2);
BEGIN
    -- 2. Open cursor
    OPEN cur_unpaid_appointments;

    -- 3. Loop through cursor records
    LOOP
        FETCH cur_unpaid_appointments INTO v_rec;
        EXIT WHEN NOT FOUND;

        v_discounted_amount := v_rec.billing_amount * (1.00 - p_billing_discount_rate);

        -- Apply batch update
        UPDATE appointments
        SET 
            billing_amount = v_discounted_amount,
            notes = COALESCE(notes, '') || ' [Discount Applied: ' || (p_billing_discount_rate * 100) || '%]'
        WHERE appointment_id = v_rec.appointment_id;

        v_updated_count := v_updated_count + 1;
    END LOOP;

    -- 4. Close cursor
    CLOSE cur_unpaid_appointments;

    RAISE NOTICE 'Successfully processed % billing records via cursor loop.', v_updated_count;
END;
$$;
```

---

## 15. ACID Transactions (COMMIT, ROLLBACK, SAVEPOINT)

```sql
-- Transaction Scenario: Booking with Payment Processing and Savepoint Recovery
BEGIN;

-- Step 1: Add new patient
INSERT INTO patients (name, age, gender, blood_group, phone, email, address)
VALUES ('Mark Sterling', 40, 'Male', 'O+', '+1-555-0888', 'mark.sterling@cloudmed.io', '22 Silicon Way')
RETURNING patient_id;

-- Step 2: Establish Savepoint
SAVEPOINT patient_created;

-- Step 3: Book appointment
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status, billing_amount, is_paid)
VALUES (currval('patients_patient_id_seq'), 1, '2026-09-22', '11:00 AM', 'Specialist Consultation', 'Scheduled', 850.00, TRUE);

-- Step 4: Conditional rollback demonstration if payment fails
-- In case of erroneous update:
-- ROLLBACK TO SAVEPOINT patient_created; -- (preserves patient, reverts appointment)

-- Final Commit to persist transactional state permanently
COMMIT;
```

---

## 16. Comprehensive Verification & Testing Suite

```sql
-- Test 1: Verify View Output
SELECT * FROM vw_active_appointments;

-- Test 2: Execute Stored Procedure
DO $$
DECLARE
    v_apt_id INT;
    v_msg VARCHAR(255);
BEGIN
    CALL sp_book_appointment(1, 2, '2026-09-25', '04:00 PM', 'Follow-up Neurology', v_apt_id, v_msg);
    RAISE NOTICE 'Result: %', v_msg;
END $$;

-- Test 3: Execute Risk Categorization Function
SELECT name, age, medical_history, fn_get_patient_risk_category(patient_id) AS risk_level
FROM patients;

-- Test 4: Inspect Trigger Audit Trail
SELECT log_id, entity_name, operation_type, entity_id, timestamp 
FROM audit_logs 
ORDER BY log_id DESC;
```

---

### 📊 Summary of Database Engineering Deliverables

| Category | Component Count | Implementation Details |
|---|---|---|
| **Tables & Entities** | 5 Relational Tables | `departments`, `doctors`, `patients`, `appointments`, `audit_logs` |
| **Integrity Constraints** | 12+ Constraints | Primary Keys, Foreign Keys (`CASCADE`/`RESTRICT`), `CHECK`, `UNIQUE`, `NOT NULL` |
| **Query Architectures** | 15+ Advanced Queries | Inner/Outer/Cross/Self Joins, Correlated Subqueries, Analytical Aggregates |
| **Virtual Views** | 2 Production Views | `vw_active_appointments`, `vw_doctor_performance` |
| **Stored Procedures** | 2 Procedures | `sp_book_appointment`, `sp_process_monthly_billing_batch` |
| **User Defined Functions** | 2 Functions | `fn_get_patient_risk_category`, `fn_get_doctor_schedule` |
| **Database Triggers** | 1 Comprehensive Trigger | `trg_appointments_audit` logging all DML mutations into `audit_logs` |
| **Cursor Processing** | 1 Batch Routine | Unpaid completed appointments batch updater with parameterized discount rate |
| **Transaction Control** | Full ACID Simulation | `BEGIN`, `COMMIT`, `SAVEPOINT`, `ROLLBACK TO SAVEPOINT` |
