## README for Assignment 2 & 3 (Project Manager)

```markdown
# Full-Stack Project Manager (Assignment 2 & 3)

This is an advanced full-stack project management application. It features secure JWT authentication, a persistent database (SQLite), and a smart scheduling API.

## 🌐 Live Demo

* **Frontend (Vercel):** `https://fullstack-project-manager-tan.vercel.app`
* **Backend (Render):** `https://fullstack-project-manager-3.onrender.com`

---

## ✨ Features

### Assignment 2: Project Manager
* **JWT Authentication:** Secure user registration and login using JSON Web Tokens.
* **Data Isolation:** Users can only view and manage their *own* projects and tasks.
* **Project Management:** Full CRUD (Create, Read, Delete) functionality for projects.
* **Task Management:** Full CRUD functionality for tasks, linked to specific projects.

### Assignment 3: Smart Scheduler
* **Scheduler API:** A dedicated endpoint (`POST /api/v1/projects/{projectId}/schedule`) that accepts a list of tasks and their dependencies.
* **Optimal Task Order:** Uses a topological sort algorithm to analyze dependencies and return the most efficient work order.
* **Scheduler UI:** A dedicated page in the app to input task JSON and visualize the recommended schedule.

---

## 🚀 Tech Stack

* **Backend:**
    * C# .NET 8 (Web API)
    * ASP.NET Core Identity & JWT (for Authentication)
    * Entity Framework Core & SQLite (for Database)
* **Frontend:**
    * React & TypeScript
    * React Router (for multi-page navigation)
    * Context API (for global auth state)
    * Bootstrap & Axios
* **Deployment:**
    * **Backend:** Deployed to **Render** using a **Dockerfile**.
    * **Frontend:** Deployed to **Vercel**.

---

## ⚙️ Local Setup

To run this project locally, you will need two terminals.

### 1. Backend (ProjectManagerApi)

```bash
# Navigate to the backend folder
cd ProjectManagerApi

# Set up the database (CRITICAL first step)
# This command creates the app.db file and runs all migrations
dotnet ef database update

# Navigate to the frontend folder
cd project-manager-ui

# Install dependencies
npm install

# Start the development server
npm start

# Run the application
dotnet run
