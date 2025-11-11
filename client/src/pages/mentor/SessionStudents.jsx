import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mentorAPI } from '../../api/mentor';
import toast from 'react-hot-toast';
import { ArrowLeft, Users, Mail, Phone } from 'lucide-react';

const SessionStudents = () => {
  const { sessionId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionStudents();
  }, [sessionId]);

  const fetchSessionStudents = async () => {
    try {
      const res = await mentorAPI.getSessionStudents(sessionId);
      setStudents(res.students || []);
    } catch (error) {
      console.error('Fetch session students error:', error);
      toast.error(error.response?.data?.msg || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-blue-700 p-4 md:p-8 relative overflow-hidden">
      {/* Back button */}
      <a
        href="/mentor/select-session-students"
        className="absolute top-4 left-4 z-20 bg-white text-blue-700 rounded-full p-2 shadow-lg hover:bg-blue-50 transition"
        title="Back to Sessions"
      >
        <ArrowLeft className="w-6 h-6" />
      </a>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      {/* Students List */}
      <div className="relative z-10 max-w-6xl mx-auto pt-16 md:pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Session Students</h1>
          <p className="text-blue-200">Students enrolled in this session</p>
        </div>

        {students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No students enrolled yet.</p>
          </div>
        ) : (
          <>
            {/* Student Count */}
            <div className="bg-white rounded-2xl shadow-xl p-4 mb-6 text-center">
              <p className="text-gray-700 font-semibold text-sm md:text-base">
                Total Students: <span className="text-blue-600 text-xl md:text-2xl">{students.length}</span>
              </p>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100 hover:shadow-2xl transition"
                >
                  {/* Student Avatar */}
                  <div className="flex flex-col items-center mb-4">
                    <img
                      src={student.profile_image_url || '/default-avatar.png'}
                      alt={student.full_name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-blue-200 mb-3"
                    />
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center">
                      {student.full_name}
                    </h3>
                  </div>

                  {/* Student Info */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-start gap-2 bg-blue-50 p-2 md:p-3 rounded-lg">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-semibold uppercase">Email</p>
                        <p className="text-gray-900 text-xs md:text-sm break-all">{student.email}</p>
                      </div>
                    </div>

                    {student.phone_number && (
                      <div className="flex items-start gap-2 bg-indigo-50 p-2 md:p-3 rounded-lg">
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                          <p className="text-gray-900 text-xs md:text-sm">{student.phone_number}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionStudents;
