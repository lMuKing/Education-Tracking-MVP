# 🎓 EdTrack - Education Tracking Platform

**EdTrack** is a MVP of comprehensive full-stack educational management platform that streamlines course management, homework assignments, and mentor-student interactions. Built with modern web technologies, it provides both a powerful RESTful API backend and an intuitive React-based frontend.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)

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
- Image validation (format, size, count limits)
- Automatic cleanup on deletion

---

## 🛠 Tech Stack

### **Backend (`/server`)**

#### **Framework & Runtime**
- **Node.js 18.x** - JavaScript runtime
- **Express.js 5.x** - Web application framework
- **Mongoose 8.x** - MongoDB ODM

#### **Database**
- **MongoDB** - NoSQL database

#### **Authentication & Security**
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **bcrypt.js** - Password hashing (10 rounds)
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-Origin Resource Sharing

#### **File Storage**
- **Cloudinary** - Cloud-based image storage
- **Multer** - File upload handling

#### **Email Service**
- **Nodemailer** - Email sending

---

### **Frontend (`/client`)**

#### **Core Framework**
- **React 18.3** - UI library
- **Vite 5.4** - Build tool and dev server
- **React Router DOM 6.27** - Client-side routing

#### **Styling**
- **TailwindCSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS preprocessing
- **Autoprefixer** - CSS vendor prefixing

#### **State Management**
- **React Context API** - Global state (Auth, Theme)
- **React Query (TanStack Query)** - Server state management
- **React Hooks** - Local component state

#### **HTTP Client & UI**
- **Axios** - API requests with interceptors
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

---



## 👨‍💻 Authors

- **lMuKing** - [GitHub](https://github.com/lMuKing)

---


<div align="center">

**Made by lMuKing**

⭐ Star this repo if you find it helpful!

</div>
