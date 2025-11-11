# 🎓 EdTrack Backend

**EdTrack** is a comprehensive educational management platform backend built with Node.js, Express, and MongoDB. It provides a complete RESTful API for managing courses, sessions, homework assignments, student enrollments, and mentor-student interactions.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen.svg)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)

---

## ✨ Features

### 👨‍💼 **Admin Management**
- Create and manage sessions (classes/courses)
- Approve mentor and student requests
- View platform statistics
- Cascade deletion of sessions with all related data

### 👨‍🏫 **Mentor Features**
- Create and manage courses
- Create homework assignments with deadlines
- Upload course materials and homework documents to Cloudinary
- View student homework submissions (images stored in Cloudinary)
- Grade student homework
- Track student enrollments
- Manage course announcements

### 👨‍🎓 **Student Features**
- Browse and enroll in courses
- Submit homework with image uploads (up to 4 images, 1MB each)
- View homework assignments and deadlines
- Track homework grades and feedback
- Receive course announcements
- View enrollment status

### 🔐 **Authentication & Security**
- JWT-based authentication
- Google OAuth 2.0 integration
- Email verification system
- Password reset functionality
- Rate limiting protection
- Helmet.js security headers
- Role-based access control (Admin, Mentor, Student)

### 📤 **File Management**
- Cloudinary integration for image storage
- Organized folder structure: `edtrack/homework_submissions/{homeworkId}/{studentId}/`
- Image validation (format, size, count limits)
- Automatic cleanup on deletion

---

## 🛠 Tech Stack

### **Backend Framework**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Mongoose** - MongoDB ODM

### **Database**
- **MongoDB** - NoSQL database

### **Authentication**
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **bcrypt.js** - Password hashing

### **File Storage**
- **Cloudinary** - Cloud-based image storage
- **Multer** - File upload handling

### **Email Service**
- **Nodemailer** - Email sending

### **Security**
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-Origin Resource Sharing

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local or Atlas) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### **Required External Services:**
- **MongoDB Atlas** account (free tier available)
- **Cloudinary** account (free tier available) - [Sign up](https://cloudinary.com/)
- **Gmail** account (for email service)
- **Google Cloud Console** project (for OAuth) - [Console](https://console.cloud.google.com/)

---


## ⚙️ Configuration

### **1. MongoDB Setup**


 MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user (Database Access)
4. Whitelist IP: `0.0.0.0/0` (Network Access)
5. Get connection string and add to `.env`

### **2. Cloudinary Setup**

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy **Cloud Name**, **API Key**, and **API Secret**
4. Add to `.env` file

### **3. Gmail Setup (for Nodemailer)**

1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate password for "Mail"
3. Use this password in `EMAIL_PASS` (not your regular Gmail password)

### **4. Google OAuth Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → Create OAuth 2.0 Client ID
5. Configure consent screen
6. Add authorized redirect URI:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://your-domain.com/api/auth/google/callback`
7. Copy Client ID and Secret to `.env`

---


## 📚 API Documentation

### **Base URL**
```
http://localhost:3000/api
```

### **Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/logout` | Logout user | ✅ |
| GET | `/auth/google` | Google OAuth login | ❌ |
| GET | `/auth/google/callback` | Google OAuth callback | ❌ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password/:token` | Reset password | ❌ |
| GET | `/auth/verify-email/:token` | Verify email | ❌ |

### **Admin Endpoints**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/admin/session` | Create new session | Admin |
| GET | `/admin/sessions` | Get all sessions | Admin |
| PUT | `/admin/session/:sessionId` | Update session | Admin |
| DELETE | `/admin/session/:sessionId` | Delete session (cascade) | Admin |
| GET | `/admin/mentor-requests` | Get mentor requests | Admin |
| PUT | `/admin/mentor-request/:requestId` | Approve/reject mentor | Admin |
| GET | `/admin/student-requests` | Get student requests | Admin |
| PUT | `/admin/student-request/:requestId` | Approve/reject student | Admin |

### **Course Endpoints**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/courses/:sessionId` | Create course | Mentor |
| GET | `/courses/session/:sessionId` | Get courses by session | All |
| GET | `/courses/:courseId` | Get course by ID | All |
| PUT | `/courses/:courseId` | Update course | Mentor |
| DELETE | `/courses/:courseId` | Delete course | Mentor |
| GET | `/courses/:courseId/students` | Get enrolled students | Mentor |

### **Homework Endpoints**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/homework/:courseId` | Create homework | Mentor |
| GET | `/homework/course/:courseId` | Get homework by course | All |
| GET | `/homework/:homeworkId` | Get homework by ID | All |
| PUT | `/homework/:homeworkId` | Update homework | Mentor |
| DELETE | `/homework/:homeworkId` | Delete homework | Mentor |
| GET | `/homework/:homeworkId/submissions` | View all submissions | Mentor |
| GET | `/homework/:homeworkId/student/:studentId` | View student submission | Mentor |

### **Student Homework Submission**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/homework-enrollment/:homeworkId/submit` | Submit homework (images) | Student |
| GET | `/homework-enrollment/student/submissions` | Get my submissions | Student |
| GET | `/homework-enrollment/:enrollmentId` | Get submission details | Student |

### **Enrollment Endpoints**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/student/enroll/course/:courseId` | Enroll in course | Student |
| GET | `/student/enrolled-courses` | Get my courses | Student |
| POST | `/student/enroll/session/:sessionId` | Enroll in session | Student |
| GET | `/student/enrolled-sessions` | Get my sessions | Student |

### **Announcements**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/announcements/:courseId` | Create announcement | Mentor |
| GET | `/announcements/course/:courseId` | Get course announcements | All |
| DELETE | `/announcements/:announcementId` | Delete announcement | Mentor |

---



---

## 🔒 Security Features

### **Implemented Security Measures:**

1. **Authentication**
   - JWT tokens with secure secrets
   - Password hashing with bcrypt (10 rounds)
   - Google OAuth 2.0 integration

2. **Authorization**
   - Role-based access control (RBAC)
   - Route protection with middleware
   - User-specific resource access

3. **Input Validation**
   - Express-validator for request validation
   - Mongoose schema validation
   - File type and size validation

4. **Rate Limiting**
   - API rate limiting with express-rate-limit
   - Protects against brute force attacks

5. **Security Headers**
   - Helmet.js for HTTP security headers
   - CORS configuration

6. **File Upload Security**
   - File type restrictions (jpg, jpeg, png only)
   - File size limits (1MB per image, max 4 images)
   - Secure Cloudinary storage

---



## 📊 Database Schema

### **Key Collections:**

- **users** - All users (Admin, Mentor, Student)
- **sessions** - Educational sessions/classes
- **courses** - Courses within sessions
- **homework** - Homework assignments
- **homeworkenrollments** - Student submissions
- **courseenrollments** - Course enrollments
- **sessionenrollments** - Session enrollments
- **announcements** - Course announcements
- **requests** - Mentor join requests
- **srequests** - Student join requests

---

## 👥 User Roles

### **Admin**
- Full platform access
- Create/manage sessions
- Approve mentor/student requests
- View platform statistics

### **Mentor**
- Create/manage courses and homework
- View student submissions
- Grade homework
- Post announcements
- Must be approved by admin

### **Student**
- Enroll in courses
- Submit homework
- View grades and feedback
- Must be approved by admin

---


## 👨‍💻 Authors

- **lMuKing** - [GitHub](https://github.com/lMuKing)

---

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the powerful database
- Cloudinary for reliable image hosting
- All contributors and supporters

---




## 🎯 Quick Start Commands

```bash
# Clone and install
git clone https://github.com/lMuKing/EdTrack.git
cd EdTrack
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev

# Run production server
npm start
```

---

<div align="center">

**Made by lMuKing**

⭐ Star this repo if you find it helpful!

</div>
