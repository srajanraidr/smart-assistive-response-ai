# 🚨 SARA - Smart AI Response Assistant

SARA (Smart AI Response Assistant) is an AI-powered emergency incident management system designed to assist emergency response teams by automatically analyzing emergency reports, generating incidents, and providing real-time dashboards for dispatchers and operators.

The system supports both **text-based emergency reports** and **audio uploads**, leveraging AI to extract critical information and recommend appropriate emergency actions.

---

## 🌐 Live Demo

* **Frontend:** https://smart-assistive-response-ai.vercel.app/
* **Backend API:** https://smart-assistive-response-ai.onrender.com/

---

## ✨ Features

* 🤖 AI-powered emergency transcript analysis
* 🎤 Audio upload and automatic transcription
* 📝 Text-based emergency report analysis
* 🚨 Automatic incident creation
* 📍 Live incident map with geolocation
* 📊 Analytics dashboard
* 🔄 Real-time updates using Socket.IO
* 👮 Dispatcher assignment workflow
* 📜 Incident status timeline and history
* 🔐 JWT-based authentication and role-based authorization
* 📱 Responsive web interface

---

## 👥 User Roles

| Role           | Permissions                                 |
| -------------- | ------------------------------------------- |
| **ADMIN**      | Full access to all features                 |
| **DISPATCHER** | View, assign, and manage incidents          |
| **OPERATOR**   | Submit incidents and upload emergency audio |

---

## 🏗️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* React Leaflet
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Prisma ORM
* MySQL
* Socket.IO
* Multer
* JWT Authentication
* Bcrypt

### AI Services

* Google Gemini API
* AssemblyAI (Speech-to-Text)

### Deployment

* Vercel (Frontend)
* Render (Backend)
* Railway (MySQL Database)

---

## 📂 Project Structure

```
smart-assistive-response-ai/
│
├── client/
│   ├── src/
│   └── public/
│
└── server/
    ├── prisma/
    ├── src/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── routes/
    │   ├── services/
    │   └── upload/
    └── package.json
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/smart-assistive-response-ai.git
cd smart-assistive-response-ai
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
CLIENT_URL=http://localhost:5173
```

Generate Prisma client:

```bash
npx prisma generate
```

Push schema:

```bash
npx prisma db push
```

Run backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🔐 Demo Accounts

| Role       | Email                                                   | Password    |
| ---------- | ------------------------------------------------------- | ----------- |
| Admin      | [admin@example.com](mailto:admin@example.com)           | password123 |
| Dispatcher | [dispatcher@example.com](mailto:dispatcher@example.com) | password123 |
| Operator   | [operator@example.com](mailto:operator@example.com)     | password123 |

> Ensure these users exist in the database before logging in.

---

## 🔄 Incident Workflow

```
NEW
   ↓
REVIEW
   ↓
ASSIGNED
   ↓
EN_ROUTE
   ↓
ON_SCENE
   ↓
RESOLVED
   ↓
CLOSED
```

---

## 📍 Core Workflow

1. User submits emergency text or uploads audio.
2. Audio is transcribed using AssemblyAI.
3. Gemini AI analyzes the transcript.
4. AI extracts:

   * Title
   * Summary
   * Emergency type
   * Priority
   * Recommended department
   * Risk level
   * Location
5. Geolocation is resolved into map coordinates.
6. Incident is stored in MySQL.
7. Dashboard receives a live Socket.IO update.
8. Dispatchers assign responders and update incident status.

---

## 📊 Main Features

* AI emergency classification
* Audio transcription
* Live dashboard
* Real-time notifications
* Incident analytics
* Interactive map
* Search and filtering
* Incident assignment
* Status history tracking

---

## 📦 Deployment

### Frontend

* Hosted on **Vercel**

### Backend

* Hosted on **Render**

### Database

* Hosted on **Railway MySQL**

---

## 🔒 Authentication

* JWT-based authentication
* Passwords hashed using Bcrypt
* Role-based access control (RBAC)

---

## 📄 License

This project is developed for educational and demonstration purposes.

---

## 👨‍💻 Author

Developed by **Srajan Rai**

SARA demonstrates how AI can be integrated into emergency response systems to improve incident reporting, prioritization, and dispatcher efficiency through automation and real-time communication.
