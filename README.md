🎓 ScholarHub

ScholarHub is a full-stack web application designed to help students manage their profiles, securely access their accounts, and evaluate resumes through keyword-based analysis.

The platform provides secure authentication, email verification, password recovery, profile management, resume analysis, notifications, and administrative controls in a modern and responsive interface.

---

🚀 Live Demo

**Website:**https://scholarhub-one.vercel.app/

---

 📸 Screenshots

 Home Page

User Dashboard

(Add Screenshot)

Resume Analyzer

(Add Screenshot)

Admin Dashboard

(Add Screenshot)

---

 ✨ Features

🔐 Authentication & Account Management

* User Registration
* User Login
* JWT-Based Authentication
* Protected Routes
* Secure Password Hashing using bcrypt
* Session Management

📧 Email Verification System

* OTP-Based Email Verification
* Secure OTP Generation
* OTP Validation
* OTP Expiry Handling
* Resend OTP Functionality
* Professional Email Delivery using Resend
* Custom Domain Email Support

🔑 Password Recovery

* Forgot Password Workflow
* OTP-Based Password Reset
* Secure Password Update
* Account Security Features

 👤 User Profile Management

* Create User Profile
* Update Profile Information
* Manage Personal Details
* Personalized Dashboard

 📄 Resume Analyzer

* PDF Resume Upload
* Resume Text Extraction
* Keyword-Based Resume Analysis
* Resume Score Calculation
* Missing Keyword Detection
* Resume Feedback Generation
* Resume Improvement Suggestions

🔔 Notifications

* User Notification Center
* Email-Based Notifications
* Automated Account Updates

👨‍💼 Admin Dashboard

* View Registered Users
* User Management
* Administrative Controls
* Platform Monitoring

🛡️ Security Features

* JWT Authentication
* bcrypt Password Hashing
* Express Rate Limiting
* Helmet Security Middleware
* Environment Variable Protection
* Input Validation
* Secure API Access

📱 Responsive Design

* Mobile-Friendly Interface
* Tablet Support
* Desktop Support
* Responsive Layout

---

🛠️ Tech Stack

 Frontend

* HTML5
* CSS3
* JavaScript

 Backend

* Node.js
* Express.js

Database

* MongoDB
* Mongoose

Authentication & Security

* JSON Web Token (JWT)
* bcryptjs
* Helmet
* Express Rate Limit

Email Services

* Resend

File Handling

* Multer
* PDF Parse

Development Tools

* Nodemon
* Git
* GitHub

---

📂 Project Structure

```
ScholarHub
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── uploads
│   ├── utils
│   ├── database
│   └── server.js
│
├── frontend
│   ├── index.html
│   ├── signup.html
│   ├── login.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── admin.html
│   └── ...
│
├── package.json
└── README.md
```

---

 ⚙️ Installation

Clone Repository

```bash
git clone https://github.com/your-username/scholarhub.git
```

Navigate to Project Folder

```bash
cd scholarhub
```

Install Dependencies

```bash
npm install
```

Configure Environment Variables

Create a `.env` file and add:

```env
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
```

 Start Development Server

```bash
npm run dev
```

Start Production Server

```bash
npm start
```

---

 🔒 Environment Variables

| Variable       | Description               |
| -------------- | ------------------------- |
| MONGODB_URI    | MongoDB Connection String |
| JWT_SECRET     | JWT Secret Key            |
| RESEND_API_KEY | Resend API Key            |

---

 🎯 Learning Outcomes

Through this project, I gained practical experience in:

* Full-Stack Web Development
* REST API Development
* MongoDB Database Management
* User Authentication & Authorization
* Email Verification Systems
* Secure Password Recovery Workflows
* Resume Parsing and Keyword Analysis
* Deployment and Production Configuration
* Security Best Practices
* Git & GitHub Workflow

---

 👨‍💻 Author

**Gaurank Verma**

GitHub: https://github.com/Gaur-1234

LinkedIn:https://www.linkedin.com/in/gaurank-verma-5929482b9/
