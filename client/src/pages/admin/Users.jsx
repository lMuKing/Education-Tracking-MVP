import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, X, ArrowLeft } from 'lucide-react';
import { adminAPI } from '../../api/admin';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Users = () => {
  const location = useLocation();
  const isReadOnly = new URLSearchParams(location.search).get('view') === 'readonly';
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.users || []);
      setFilteredUsers(response.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.user_role);
    setShowModal(true);
  };

  const handleUpdateRole = async () => {
    if (!newRole) {
      toast.error('Please select a role');
      return;
    }
    try {
      await adminAPI.updateUserRole(selectedUser.id, newRole);
      toast.success('User role updated successfully');
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      {/* Back button */}
      <a
        href="/admin/dashboard"
        className="fixed md:absolute top-4 left-4 z-20 bg-white text-blue-700 rounded-full p-2 shadow-lg hover:bg-blue-50 transition"
        title="Back to Dashboard"
      >
        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
      </a>

      <div className="max-w-7xl mx-auto pt-12 md:pt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Users Management</h1>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 mb-4 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              className="w-full pl-8 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.user_role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                          user.user_role === 'Mentor' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.user_role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!isReadOnly && (
                          <>
                            <button
                              onClick={() => handleEditRole(user)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              No users found
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.full_name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.user_role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      user.user_role === 'Mentor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.user_role}
                    </span>
                  </div>
                </div>
                {!isReadOnly && (
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleEditRole(user)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit Role</span>
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Edit Role Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">Edit User Role</h2>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">User: {selectedUser?.full_name}</p>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateRole}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Role
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
