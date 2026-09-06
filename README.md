# CloudMed - Healthcare Appointment & Patient Management Platform

**Course**: BACSE344 - Cloud Infrastructure and Architecture  
**Digital Assignment Submission** (C1 Slot)  
**Faculty**: Dr. P. Anandan  

---

## 📋 Executive Summary & Problem Selection

Healthcare facilities often struggle with fragmented patient scheduling, missing consultation records, and inefficient doctor allocation. **CloudMed** addresses this real-world problem by providing a cloud-native, responsive web application that streamlines healthcare appointment management, patient medical record keeping, and doctor scheduling.

### Key Features:
- **Complete CRUD Support**: Create, Read, Update, and Delete appointments and patient records.
- **RESTful API Architecture**: Standardized REST JSON API backend.
- **Cloud Database Ready**: Persistent JSON file-backed database engine with easy cloud adapter support (MongoDB Atlas / Supabase / Render Postgres).
- **Interactive UI Dashboard**: Responsive SPA built with React, Vite, and Tailwind CSS.
- **Embedded Architecture & API Explorer**: In-app documentation and cloud architecture breakdown.

---

## 🏗️ System Architecture & Cloud Infrastructure

CloudMed follows a 3-Tier Cloud-Native Architecture designed for cloud deployment on platforms such as Render, Vercel, Railway, or AWS.

```
[ Client Presentation Tier ] ──(HTTP / REST JSON)──> [ Express Application Server ] ──> [ Database Persistence Tier ]
    React + Tailwind SPA                                   Node.js REST API                      Cloud DB Engine
  (Hosted on Vercel / Netlify)                           (Hosted on Render / AWS)            (Supabase / Cloud DB)
```

### Architectural Tiers:
1. **Presentation Tier (Frontend)**: React Single Page Application compiled with Vite & Tailwind CSS. Serves interactive dashboards, appointment creation forms, and patient management interfaces.
2. **Application Tier (Backend)**: Express.js REST API handling CORS, route validation, health checks (`/api/health`), and business logic.
3. **Data Persistence Tier (Database)**: Cloud-ready database storing patients, doctors, and appointments with foreign key relational integrity.

---

## 🗄️ Database Design

### 1. `patients` Table
| Column Name | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary Key (Auto-Increment) |
| `name` | TEXT | Patient Full Name |
| `age` | INTEGER | Age |
| `gender` | TEXT | Gender (Male / Female / Other) |
| `blood_group` | TEXT | Blood Group (A+, O+, etc.) |
| `phone` | TEXT | Contact Phone Number |
| `email` | TEXT | Unique Email Address |
| `address` | TEXT | Residential Address |
| `medical_history` | TEXT | Pre-existing medical conditions |

### 2. `doctors` Table
| Column Name | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary Key |
| `name` | TEXT | Doctor Full Name |
| `specialty` | TEXT | Medical Specialization |
| `email` | TEXT | Official Email |
| `phone` | TEXT | Office Phone |
| `department` | TEXT | Department Name |
| `available_days` | TEXT | Active consultation days |

### 3. `appointments` Table
| Column Name | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary Key |
| `patient_id` | INTEGER | Foreign Key -> `patients(id)` |
| `doctor_id` | INTEGER | Foreign Key -> `doctors(id)` |
| `appointment_date`| TEXT | Date (YYYY-MM-DD) |
| `appointment_time`| TEXT | Time slot |
| `reason` | TEXT | Visit reason |
| `status` | TEXT | `Scheduled` \| `Completed` \| `Cancelled` |
| `notes` | TEXT | Clinical notes / prescriptions |

---

## 🔌 RESTful API Endpoints (CRUD)

| HTTP Method | Endpoint | Description | CRUD Operation |
|---|---|---|---|
| `GET` | `/api/appointments` | List all appointments with filters | **READ** |
| `GET` | `/api/appointments/:id` | Get single appointment details | **READ** |
| `POST` | `/api/appointments` | Create new appointment record | **CREATE** |
| `PUT` | `/api/appointments/:id` | Update status, notes, or date/time | **UPDATE** |
| `DELETE` | `/api/appointments/:id` | Cancel & delete appointment | **DELETE** |
| `GET` | `/api/patients` | Search & list patient records | **READ** |
| `POST` | `/api/patients` | Register new patient record | **CREATE** |
| `PUT` | `/api/patients/:id` | Edit patient medical profile | **UPDATE** |
| `DELETE` | `/api/patients/:id` | Delete patient record | **DELETE** |
| `GET` | `/api/doctors` | Get medical staff directory | **READ** |
| `GET` | `/api/analytics/overview`| Fetch system status & metrics | **READ** |
| `GET` | `/api/health` | Health check endpoint | **READ** |

---

## ☁️ Cloud Deployment Guide

### Option 1: One-Click Render Deployment (Free Tier)
1. Push repository to GitHub.
2. Sign in to [Render](https://render.com).
3. Create a **New Web Service** and connect your GitHub repository.
4. Set Build Command: `cd server && npm install`
5. Set Start Command: `node server/server.js`
6. Deploy! Render will assign a public SSL URL (e.g. `https://cloudmed-api.onrender.com`).

### Option 2: Docker Container Deployment
Run the application locally or on any cloud VPS (AWS EC2 / DigitalOcean) using Docker:

```bash
# Build Docker image
docker build -t cloudmed-app .

# Run container on port 5000
docker run -d -p 5000:5000 --name cloudmed_container cloudmed-app
```

Or using Docker Compose:
```bash
docker-compose up -d
```

---

## 🚀 Local Development Setup

### 1. Start Express REST API Backend
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Start React Frontend SPA
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` with automatic API proxying to port 5000.*

---

## 💯 BACSE344 Evaluation Rubric Checklist

- [x] **Problem Selection & System Architecture (1 Mark)**: Clear real-world problem with 3-tier cloud architecture diagram.
- [x] **Application Development (3 Marks)**: Fully functional React SPA with interactive dashboard, modals, and search filters.
- [x] **Database & REST API Integration (2 Marks)**: Full CRUD (Create, Read, Update, Delete) support over RESTful JSON endpoints.
- [x] **Cloud Deployment & Integration (2 Marks)**: Docker containerization files and Render/Vercel step-by-step deployment setup.
- [x] **Documentation & Demonstration (2 Marks)**: Comprehensive README, embedded API documentation viewer, and cloud architecture explorer.
