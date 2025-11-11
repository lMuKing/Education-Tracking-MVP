# 🎓 EdTrack Frontend

**EdTrack Frontend** is a modern, responsive educational management platform built with React, Vite, and TailwindCSS. It provides an intuitive user interface for students, mentors, and administrators to manage courses, homework, and educational sessions.

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React%20Router-6.27-CA4245.svg)](https://reactrouter.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)

---

## ✨ Features

### 👨‍💼 **Admin Dashboard**
- Session management interface
- Approve/reject mentor and student requests
- View platform statistics and analytics
- User management dashboard
- Real-time request notifications

### 👨‍🏫 **Mentor Interface**
- Intuitive course creation and management
- Homework assignment creation with file uploads
- View and grade student submissions
- Student enrollment tracking
- Course announcements management
- Profile and settings management

### 👨‍🎓 **Student Portal**
- Browse available courses and sessions
- Enroll in courses with one click
- Submit homework with image uploads (drag & drop)
- View homework grades and feedback
- Track course progress
- Receive course announcements

### 🎨 **UI/UX Features**
- Fully responsive design (mobile, tablet, desktop)
- Dark/Light theme support
- Toast notifications for user feedback
- Loading states and skeleton screens
- Error boundaries and fallback UI
- Smooth animations and transitions

### 🔐 **Authentication**
- Login/Register with email
- Google OAuth integration
- Email verification
- Password reset functionality
- Protected routes
- Persistent authentication with JWT

### 📤 **File Upload**
- Drag and drop image upload
- Multiple image selection (up to 4)
- Image preview before upload
- File size validation (1MB per image)
- Progress indicators

---

## 🛠 Tech Stack

### **Core Framework**
- **React 18.3** - UI library
- **Vite 5.4** - Build tool and dev server
- **React Router DOM 6.27** - Client-side routing

### **Styling**
- **TailwindCSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS preprocessing
- **Autoprefixer** - CSS vendor prefixing

### **State Management**
- **React Context API** - Global state (Auth, Theme)
- **React Query** - Server state management and caching
- **React Hooks** - Local component state

### **HTTP Client**
- **Axios** - API requests with interceptors

### **UI Components & Icons**
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

### **Development Tools**
- **ESLint** - Code linting
- **Vite HMR** - Hot Module Replacement

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **Backend API** running (see [backend README](../README.md))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/lMuKing/Education-Tracking-MVP.git
cd Education-Tracking-MVP/client
```

### 2. Install Dependencies

```bash
npm install
```


---

## 📁 Project Structure

```
client/
├── public/
│   └── images/                    # Static images
│
├── src/
│   ├── api/                       # API service layer
│   │   ├── axios.js              # Axios instance with interceptors
│   │   ├── auth.js               # Authentication API calls
│   │   ├── course.js             # Course API calls
│   │   ├── homework.js           # Homework API calls
│   │   ├── session.js            # Session API calls
│   │   ├── student.js            # Student API calls
│   │   ├── mentor.js             # Mentor API calls
│   │   ├── admin.js              # Admin API calls
│   │   └── announcement.js       # Announcement API calls
│   │
│   ├── components/               # Reusable components
│   │   ├── AdminNavbar.jsx       # Admin navigation
│   │   ├── LogoutButton.jsx      # Logout functionality
│   │   └── student/
│   │       ├── StudentNavbar.jsx # Student navigation
│   │       └── SubmitHomework.jsx # Homework submission form
│   │
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── ThemeContext.jsx      # Theme (dark/light) state
│   │
│   ├── hooks/                    # Custom React hooks
│   │
│   ├── pages/                    # Page components
│   │   ├── Landing.jsx           # Landing page
│   │   ├── PublicCourses.jsx     # Public course listing
│   │   │
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyEmail.jsx
│   │   │
│   │   ├── admin/                # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sessions.jsx
│   │   │   ├── Requests.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Announcements.jsx
│   │   │
│   │   ├── mentor/               # Mentor pages
│   │   │   ├── Courses.jsx
│   │   │   ├── CreateCourse.jsx
│   │   │   ├── AllSessions.jsx
│   │   │   ├── BrowseSessions.jsx
│   │   │   ├── AllRequests.jsx
│   │   │   ├── ApprovedRequests.jsx
│   │   │   ├── Announcements.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   └── ...
│   │   │
│   │   └── student/              # Student pages
│   │       └── ...
│   │
│   ├── styles/                   # Additional styles
│   │
│   ├── utils/                    # Utility functions
│   │
│   ├── App.jsx                   # Main App component with routes
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles + Tailwind imports
│
├── .env                          # Environment variables (not in repo)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore file
├── index.html                    # HTML template
├── package.json                  # Project dependencies
├── tailwind.config.js            # TailwindCSS configuration
├── postcss.config.js             # PostCSS configuration
├── vite.config.js                # Vite configuration
└── README.md                     # This file
```

---

## 🎨 Styling & Theming

### **TailwindCSS Configuration**

Custom colors, fonts, and utilities are configured in `tailwind.config.js`.

```



## 👨‍💻 Authors

- **lMuKing** - [GitHub](https://github.com/lMuKing)

---

## 🎯 Quick Start Commands

```bash
# Clone and navigate
git clone https://github.com/lMuKing/Education-Tracking-MVP.git
cd Education-Tracking-MVP/client

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API URL

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---


<div align="center">

**Made by lMuKing**

⭐ Star this repo if you find it helpful!

</div>
