# CSV Filter Platform

A full-stack CSV Data Management and Filtering Platform built using **Flask, Pandas, SQLite, HTML, CSS, and JavaScript**.
This application allows users to upload CSV files, dynamically preview data, apply multiple filters, sort data, select columns, and download processed CSV files.

---

# 🚀 Live Demo

## Frontend

https://csv-filter-platform.netlify.app/

## Backend API

https://csv-filter-platform.onrender.com

---

# 📌 Features

## CSV Upload

* Upload CSV files dynamically
* Backend file validation
* Secure file handling

---

## Dynamic Column Extraction

* Automatically fetches CSV columns
* Displays columns dynamically on frontend

---

## Data Preview

* Displays uploaded CSV data in table format
* Dynamic rendering using JavaScript

---

## Multi-Filter System

Apply multiple filters simultaneously:

* Equals
* Not Equals
* Greater Than
* Less Than
* Contains

Example:
salary > 50000
department contains AI

---

## Sorting

* Ascending sorting
* Descending sorting

---

## Multi-Column Selection

* Select only required columns
* Preview selected columns dynamically
* Download only selected columns

---

## Search Functionality

* Real-time table search
* Dynamic filtering on frontend

---

## CSV Download

* Download filtered and selected data as CSV
* Backend-generated downloadable files

---

## Responsive Frontend Dashboard

* Clean UI
* Responsive layout
* Interactive data controls

---

# 🛠️ Tech Stack

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript

## Backend

* Flask
* Flask-CORS
* Flask-SQLAlchemy
* Pandas

## Database

* SQLite

## Deployment

* Netlify (Frontend)
* Render (Backend)

---

# 📂 Project Structure

```plaintext
csv-filter-platform/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── uploads/
│   ├── filtered/
│   ├── database/
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation & Local Setup

## 1. Clone Repository

```bash
https://github.com/akashapxz/csv-filter-platform
```

---

## 2. Navigate to Project

```bash
cd csv-filter-platform
```

---

## 3. Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Mac/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 4. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## 5. Run Backend

```bash
python app.py
```

Backend runs at:

```plaintext
http://127.0.0.1:5000
```

---

## 6. Run Frontend

Open:

```plaintext
frontend/index.html
```

using:

* Live Server extension
  OR
* any static server

---

# 📡 API Endpoints

## Upload CSV

```http
POST /api/upload
```

---

## Filter Data

```http
POST /api/filter
```

---

## Select Columns

```http
POST /api/select-columns
```

---

## Download CSV

```http
POST /api/download
```

---

# 🌐 Deployment

## Frontend Deployment

Hosted on:

* Netlify

## Backend Deployment

Hosted on:

* Render

---

# ⚠️ Note

The backend is hosted on Render free tier.
The first request after inactivity may take a few seconds while the server wakes up.

---

# 📈 Future Improvements

* Pagination
* Upload History Dashboard
* Authentication System
* Cloud File Storage
* Data Visualization Charts
* Advanced Query Builder

---

# 👨‍💻 Author

Akash J P

---

# 📄 License

This project is created for educational and internship evaluation purposes.
