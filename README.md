# 📇 Contact Manager App

A full-stack **Contact Manager** application built using the **MERN Stack** (MongoDB, Express, React, Node.js). This app enables users to securely register/login, manage their personal and work contacts, and enjoy a smooth UI with JWT authentication.

---

## 🔧 Tech Stack

### ⚛️ Frontend
- React (Vite)
- React Router
- Axios
- Bootstrap 5

### 🛠️ Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- dotenv
- CORS
- Rate Limiting

---

## ✨ Features

- 🔐 JWT-based User Authentication
- 📇 Add, View, Edit & Delete Contacts
- 🔍 Filter Contacts by Type (Personal / Work)
- 🛡️ Protected API Routes
- ⚠️ Inline Error Handling & Notifications
- ⏱️ Auto-dismiss Alerts for better UX

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
 https://github.com/new-programmer-tech/Newtin-Assignment.git
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

#### 📁 Create a `.env` file inside the `backend/` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/contact_manager

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

### 3️⃣ Seed the Database (Only Once)

Run this command to populate the database with 2 users and 5 contacts each:

```bash
node src/utils/seed.js
```

---

### 4️⃣ Start the Backend Server

```bash
npm run dev
```

> The API will be available at: [http://localhost:5000/api](http://localhost:5000/api)

---

### 5️⃣ Frontend Setup


#### 📁 Create a `.env` file inside the `frontend/` directory with the following content:

```env
VITE_API_BASE_URL=http://localhost:5000/api

```

---

```bash
cd frontend
npm install
npm run dev
```

> The frontend will be running at: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing Users

Once seeded, you can log in with:

```bash
Email: johndoe@example.com
Password: password123
```

or

```bash
Email: janedoe@example.com
Password: password123
```

---

