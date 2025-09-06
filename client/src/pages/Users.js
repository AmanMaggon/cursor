import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield
} from 'lucide-react';
import { usersAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const Users = () => {
  const { elderlyMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch users
  const { data: usersData, isLoading, refetch } = useQuery(
    ['users', { search: searchTerm, status: statusFilter, role: roleFilter, page: currentPage }],
    () => usersAPI.getUsers({
      search: searchTerm,
      status: statusFilter,
      role: roleFilter,
      page: currentPage,
      limit: 10
    }),
    {
      keepPreviousData: true,
    }
  );

  const users = usersData?.data?.users || [];
  const totalPages = usersData?.data?.totalPages || 1;

  const handleVerifyUser = async (userId) => {
    try {
      await usersAPI.verifyUser(userId);
      toast.success('User verified successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      await usersAPI.suspendUser(userId, 'Policy violation');
      toast.success('User suspended successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await usersAPI.activateUser(userId);
      toast.success('User activated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to activate user');
    }
  };

  const getStatusBadge = (status, isVerified, aadhaarVerified) => {
    if (!isVerified) {
      return <span className="badge badge-warning">Unverified</span>;
    }
    if (!aadhaarVerified) {
      return <span className="badge badge-warning">Aadhaar Pending</span>;
    }
    if (status === 'active') {
      return <span className="badge badge-success">Active</span>;
    }
    if (status === 'suspended') {
      return <span className="badge badge-danger">Suspended</span>;
    }
    return <span className="badge badge-neutral">Inactive</span>;
  };

  const UserModal = ({ user, isOpen, onClose }) => {
    if (!isOpen || !user) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">User Details</h3>
                <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-neutral-600 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Email</label>
                    <p className="text-sm text-neutral-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Phone</label>
                    <p className="text-sm text-neutral-900">{user.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Gender</label>
                    <p className="text-sm text-neutral-900 capitalize">{user.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Blood Group</label>
                    <p className="text-sm text-neutral-900">{user.bloodGroup}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-neutral-700">Address</label>
                  <p className="text-sm text-neutral-900">
                    {user.address?.street}, {user.address?.city}, {user.address?.state} - {user.address?.pincode}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-neutral-700">
                      {user.isVerified ? 'Email Verified' : 'Email Unverified'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm text-neutral-700">
                      {user.aadhaarVerified ? 'Aadhaar Verified' : 'Aadhaar Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${elderlyMode ? 'space-y-8' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`text-2xl font-bold text-neutral-900 ${elderlyMode ? 'text-3xl' : ''}`}>
            Users Management
          </h1>
          <p className={`text-neutral-600 mt-1 ${elderlyMode ? 'text-lg' : ''}`}>
            Manage and monitor all platform users
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Roles</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="chemist">Chemist</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="btn btn-secondary w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-primary-600">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-neutral-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-neutral-500">
                            ID: {user._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-neutral-900">{user.email}</div>
                      <div className="text-sm text-neutral-500">{user.phone}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral capitalize">{user.role}</span>
                    </td>
                    <td>
                      {getStatusBadge(user.status, user.isVerified, user.aadhaarVerified)}
                    </td>
                    <td>
                      <div className="text-sm text-neutral-900">
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-1 text-neutral-400 hover:text-neutral-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {!user.isVerified && (
                          <button
                            onClick={() => handleVerifyUser(user._id)}
                            className="p-1 text-green-400 hover:text-green-600"
                            title="Verify User"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleSuspendUser(user._id)}
                            className="p-1 text-red-400 hover:text-red-600"
                            title="Suspend User"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(user._id)}
                            className="p-1 text-green-400 hover:text-green-600"
                            title="Activate User"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-700">
          Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, usersData?.data?.total || 0)} of {usersData?.data?.total || 0} users
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-neutral-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default Users;