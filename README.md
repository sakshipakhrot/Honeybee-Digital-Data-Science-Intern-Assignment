# Honeybee-Digital-Data-Science-Intern-Assignment
# Business Directory Insights Dashboard

A full-stack, real-time analytics dashboard designed to visualize, filter, and manage business directory leads. This application features a high-performance Python backend and a responsive, modern React frontend.

## 🚀 Features
* **Real-Time Analytics:** Dynamic rendering of business distributions across cities, categories, and acquisition sources.
* **Multi-Dimensional Filtering:** Aggregate data updates instantly based on stacked filter parameters (City, Category, Source).
* **RESTful API:** Robust backend endpoints built with FastAPI, featuring SQLAlchemy for secure database transactions.
* **Modern UI/UX:** Fully responsive interface styled with Tailwind CSS, featuring interactive Recharts data visualizations.

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide React
* **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy
* **Database:** MySQL
* **Architecture:** Client-Server, REST API

---

## ⚙️ Local Setup Instructions

### Prerequisites
* Python 3.9+
* Node.js & npm (v18+)
* MySQL Server (e.g., XAMPP)

### 1. Database Configuration
1. Start your local MySQL server.
2. Create a new database (e.g., `directory_db`).
3. Execute the `listing_table.sql` file provided in the root directory to generate the `listing_table` structure.
4. Update the database connection string in `database.py` with your local credentials.

### 2. Backend Setup (FastAPI)
Navigate to the root directory and set up your Python environment:

```bash
# Create and activate a virtual environment (optional but recommended)
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

### 3. Frontend Setup (React/Vite)
Open a **new** terminal window, navigate into the `frontend` directory, and set up your Node environment:
(All the files except the one uploaded in this repository will be same as that of downloaded from https://nodejs.org/)

```bash
# Navigate into the frontend folder
cd frontend

# Install frontend dependencies (Tailwind CSS, Recharts, Lucide React, etc.)
npm install

# Start the Vite development server
npm run dev
```
