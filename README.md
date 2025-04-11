
# eCare App Server

## 🚀 Description
A robust backend server for the **eCare App**, built with **Node.js** and **Express**. This server provides RESTful API endpoints for user management, appointment booking, physician handling, and other core healthcare services.

---

## ✨ Features
- 🔐 User Authentication & Authorization
- 🩺 Physician Management
- 🕒 Appointment Scheduling
- 🧾 Service Management
- 🧬 Demographics Data Handling
- 📄 PDF Generation
- 📘 Swagger API Documentation
- 🔑 Token-based Authentication (JWT)
- 🔁 Real-time Data Updates
- 🗂️ File Upload (Multer)
- 🧼 Input Validation & Sanitization
- 🌍 CORS Support
- 📦 Secure Password Encryption (Bcrypt)
- 🧠 Error Logging & Monitoring

---

## 🛠️ Technologies Used
- Node.js & Express.js
- MongoDB & Mongoose
- JWT & Bcrypt
- Firebase Admin SDK
- Swagger UI
- Multer, Dotenv, CORS, Nodemon
- Express Validator

---

## 📦 Prerequisites
- Node.js (v14+)
- MongoDB
- Firebase Admin SDK Config
- Postman / Thunder Client

---

## 🔧 Installation

```bash
# Clone the repository
git clone <repository-url>
cd server

# Install dependencies
npm install

# Environment configuration
touch .env
```

### ✏️ Add the following to `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
FIREBASE_CONFIG=your_firebase_config
NODE_ENV=development
```

---

## 📁 Project Structure

```
server/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── swagger.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 📘 API Documentation
View complete API docs via Swagger:
```
https://ecare-erkn.onrender.com/api-docs

```

---

## 📌 API Endpoints

### 👤 Users
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `DELETE /api/users/:id`

### 🩺 Physicians
- `GET /api/physicians`
- `GET /api/physicians/:id`

### 📅 Appointments
- `GET /api/appointments`
- `GET /api/appointments/:id`
- `POST /api/appointments`
- `PUT /api/appointments/:id`

### 🧾 Services
- `GET /api/services`

### 🧬 Demographics
- `GET /api/demographics`
- `POST /api/demographics`
- `PUT /api/demographics/:id`

### 📄 PDF Generation
- `POST /api/pdf/generate`
- `GET /api/pdf/:id`

---

## 🛡️ Security Features
- JWT Auth & Token Expiry
- Password Hashing with Bcrypt
- Secure Headers & CORS Setup
- Firebase Authentication
- XSS Protection & Rate Limiting
- Input Sanitization & Validation

---

## 🧪 Testing
- Use Postman or Thunder Client

---

## 🚀 Deployment
- Configure environment variables
- Deploy on platforms like Render, Vercel, or Heroku

---

