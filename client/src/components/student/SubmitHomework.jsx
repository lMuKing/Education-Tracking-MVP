import { useState, useRef, useMemo } from 'react';
import { X, Upload, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { studentAPI } from '../../api/student';
import toast from 'react-hot-toast';

const SubmitHomework = ({ homework, onClose, onSuccess, isDarkMode }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Convert deadline strings to Date objects once when component mounts
  const deadlines = useMemo(() => ({
    regular: new Date(homework.deadline),
    extended: homework.extended_deadline ? new Date(homework.extended_deadline) : null
  }), [homework.deadline, homework.extended_deadline]);

  // Calculate if submission is late
  const isLate = useMemo(() => {
    const now = new Date();
    const finalDeadline = deadlines.extended || deadlines.regular;
    return now > finalDeadline;
  }, [deadlines]);

  // Check if submission is within extended deadline period
  const isInExtendedPeriod = useMemo(() => {
    if (!deadlines.extended) return false;
    const now = new Date();
    return now > deadlines.regular && now <= deadlines.extended;
  }, [deadlines]);

  // File validation
  const validateFiles = (files) => {
    const maxSize = 1024 * 1024; // 1MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const errors = [];

    // Check number of files
    if (files.length > 4) {
      errors.push('Maximum 4 files allowed');
      return errors;
    }

    // Check each file
    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported image type. Only JPG, JPEG, and PNG are allowed.`);
      }
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large. Maximum file size is 1MB.`);
      }
    });

    return errors;
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const errors = validateFiles(files);

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      event.target.value = null; // Reset input
      return;
    }

    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      await studentAPI.submitHomework(homework._id, formData);
      toast.success('Homework submitted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Submit homework error:', error);
      toast.error(error.response?.data?.msg || 'Failed to submit homework');
    } finally {
      setLoading(false);
    }
  };

  // Deadline warning message based on current state
  const deadlineMessage = useMemo(() => {
    if (isLate) {
      return {
        type: 'error',
        message: 'Submission deadline has passed',
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />
      };
    }
    if (isInExtendedPeriod) {
      return {
        type: 'warning',
        message: `Late submission (${homework.late_submission_penalty}% penalty applies)`,
        icon: <Clock className="w-5 h-5 text-orange-500" />
      };
    }
    return {
      type: 'info',
      message: 'Regular submission period',
      icon: <Calendar className="w-5 h-5 text-green-500" />
    };
  }, [isLate, isInExtendedPeriod, homework.late_submission_penalty]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`relative max-w-2xl w-full rounded-xl shadow-lg p-6 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Submit Homework</h2>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            {homework.title}
          </p>
        </div>

        {/* Deadline Status */}
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          isLate ? 'bg-red-500/10 text-red-500' :
          isInExtendedPeriod ? 'bg-orange-500/10 text-orange-500' :
          'bg-green-500/10 text-green-500'
        }`}>
          {deadlineMessage.icon}
          <div>
            <p className="font-medium">{deadlineMessage.message}</p>
            <p className="text-sm">
              {isInExtendedPeriod ? 
                `Extended deadline: ${deadlines.extended.toLocaleDateString()}` :
                `Deadline: ${deadlines.regular.toLocaleDateString()}`
              }
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit}>
          {/* File Requirements */}
          <div className={`mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <h3 className="font-semibold mb-2">File Requirements:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Maximum 4 images</li>
              <li>Accepted formats: JPG, JPEG, PNG</li>
              <li>Maximum size per image: 1MB</li>
            </ul>
          </div>

          {/* File Input */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png"
              multiple
              className="hidden"
            />
            
            {selectedFiles.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded flex items-center gap-2 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                      }`}
                    >
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFiles(files => files.filter((_, i) => i !== index));
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Select more files
                </button>
              </div>
            ) : (
              <div>
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Select images to upload
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || isLate}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                isLate
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : loading
                    ? 'bg-blue-600 text-white cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Homework
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold ${
                isDarkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitHomework;