


const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/database');

require('./Config/passport');


require('dotenv').config();

const app = express();



// Connect to database
connectDB();


// Middleware

// CORS Configuration - MUST be before routes
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5173',
  process.env.FRONTEND_URL // Your production frontend URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());  // This middleware parses incoming JSON data from the request body and converts it into a JavaScript object.
// It is important When a client sends data we can access that data like:  req.body.name

app.use(express.urlencoded({ extended: true })); // This middleware parses incoming HTML data from the request body and converts it into a JavaScript object.

// Load cookie-parser BEFORE routes

const cookieParser = require('cookie-parser');
app.use(cookieParser()); // this Read cookies sent by Postman/browser on future requests



// Routes

app.get('/', (req, res) => { // homepage
  res.json({ message: 'API is running' });
});


// Auth Routes
const passport = require('passport');
app.use(passport.initialize());


const authRoutes = require('./Routes/authRoutes');
app.use('/api/auth', authRoutes);


// Admin Routes :

const AdminRoutes = require('./Routes/adminRoutes');
app.use('/api/admin',AdminRoutes);

//Mentor Profile Routes:

const mentorRoutes = require('./Routes/mentorRoutes');
app.use('/api/mentor/profile',mentorRoutes);

//Mentor Sessions Routes:

const sessionRoutes = require('./Routes/sessionRoutes');
app.use('/api/mentor/',sessionRoutes);
app.use('/api/session/',sessionRoutes); // Alternative path for frontend compatibility

//Mentor Courses Routes:

const courseRoutes = require('./Routes/courseRoutes');
app.use('/api/mentor/',courseRoutes);

// Announcement Routes
const announcementRoutes = require('./Routes/announcementsRoutes');
app.use('/api/mentor/', announcementRoutes);


// Homework Routes
const homeworkRoutes = require('./Routes/homeworkRoutes');
app.use('/api/mentor/', homeworkRoutes);

// Student Profile Routes
const studentRoutes = require('./Routes/studentRoutes');
app.use('/api/student/profile', studentRoutes);


// Student Profile Routes
const studentaRoutes = require('./Routes/studentRoutes');
app.use('/api/student/', studentaRoutes);

// Student Requests Routes
const sessionEnrollmentRoutes  = require('./Routes/sessionEnrollmentRoutes ');
app.use('/api/student/', sessionEnrollmentRoutes );

// Student Requests Routes
const courseEnrollementRoutes  = require('./Routes/courseEnrollementRoutes');
app.use('/api/student/', courseEnrollementRoutes );

// Student Requests Routes
const homeworkEnrollementRoutes  = require('./Routes/homeworkEnrollementRoutes');
app.use('/api/student/', homeworkEnrollementRoutes );





// Start Server

const PORT = process.env.PORT || 3000; // Uses .env value like PORT=5000 if it exists Otherwise defaults to 3000

app.listen(PORT, () => {  // Starts the server and listens for requests on the chosen port.
  console.log(`Server running on port ${PORT}`);
});


