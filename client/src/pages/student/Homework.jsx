import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StudentNavbar from '../../components/student/StudentNavbar';

const Homework = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Homework</h1>
            <p className="text-gray-600">View and manage your homework assignments</p>
          </div>
          <p>Student homework content goes here</p>
        </div>
      </div>
    </div>
  );
};

export default Homework;
