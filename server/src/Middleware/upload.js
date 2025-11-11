const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudinary');

// Configure Cloudinary storage for session images
const sessionStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'edtrack/sessions', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }] // Optional: resize images
  }
});

// Configure Cloudinary storage for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'edtrack/profiles', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: resize images
  }
});

// Configure storage for homework submissions
const homeworkStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { homeworkId } = req.params;
    const studentId = req.user._id;
    const timestamp = Date.now();
    
    return {
      folder: `edtrack/homework_submissions/${homeworkId}/${studentId}`,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: `${timestamp}_${file.originalname.split('.')[0]}`,
      transformation: [{ quality: 'auto:good' }]
    };
  }
});

// File filter to allow only images
const imageFilter = function (req, file, cb) {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instances
const uploadSessionImage = multer({
  storage: sessionStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: imageFilter
});

// Add error handling wrapper - accepts both 'image' and 'session_image' field names
const uploadSessionImageWithErrorHandling = (req, res, next) => {
  // Use fields() to accept both possible field names
  const upload = multer({
    storage: sessionStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter
  }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'session_image', maxCount: 1 }
  ]);
  
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        msg: 'File upload error',
        error: err.message
      });
    } else if (err) {
      return res.status(500).json({ msg: 'Upload failed', error: err.message });
    }
    
    // Normalize: if 'image' was uploaded, map it to req.file
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        req.file = req.files.image[0];
      } else if (req.files.session_image && req.files.session_image[0]) {
        req.file = req.files.session_image[0];
      }
    }
    
    next();
  });
};

const uploadProfileImage = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: imageFilter
});

// Homework submission upload middleware with error handling
const uploadHomeworkSubmission = (req, res, next) => {
  const upload = multer({
    storage: homeworkStorage,
    limits: {
      fileSize: 1 * 1024 * 1024 // 1MB max file size
    },
    fileFilter: imageFilter
  }).array('images', 4); // Allow maximum 4 images per submission

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          msg: 'File too large',
          error: 'Each image must be less than 1MB'
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          msg: 'Too many files',
          error: 'Maximum 4 images allowed per submission'
        });
      }
      return res.status(400).json({
        msg: 'File upload error',
        error: err.message
      });
    } else if (err) {
      return res.status(500).json({
        msg: 'Upload failed',
        error: err.message
      });
    }
    next();
  });
};

module.exports = {
  uploadSessionImage: uploadSessionImageWithErrorHandling,
  uploadProfileImage,
  uploadHomeworkSubmission
};
