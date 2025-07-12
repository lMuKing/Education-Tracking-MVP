const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const secretKey = process.env.JWT_SECRET;

//  Protect middleware — for authenticated users only
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check for token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Access denied. No token provided.' });
    }

    // 2. Extract and verify token
    const token = authHeader.split(' ')[1]; // Extracts just the token part (after "Bearer").
    const decoded = jwt.verify(token, secretKey); // Verifies the token using your .env secret key. && decoded contains the payload

    // 3. Attach user to request
    const user = await User.findById(decoded.id).select('-password');// Looks up the user in the database using the ID from the token. && .select('-password') hides the password field for security.
    if (!user) return res.status(401).json({ msg: 'User not found' });

    req.user = user;
    next();

  } catch (err) {
    res.status(401).json({ msg: 'Invalid or expired token', error: err.message });
  }
};


exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.user_role)) {
      return res.status(403).json({ msg: 'Access denied. Insufficient role.' });
    }
    next();
  };
};


// those function i use them like this :

// router.get('/dashboard', protect, restrictTo('student', 'Parent'), dashboardController.view);

