import React from 'react';
import { useQuery } from 'react-query';
import { 
  Users, 
  UserCheck, 
  Building2, 
  Calendar, 
  FileText, 
  Pill, 
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { elderlyMode } = useTheme();

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery(
    'dashboard-stats',
    () => analyticsAPI.getDashboardStats(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-neutral-600 ${elderlyMode ? 'text-lg' : 'text-sm'} font-medium`}>
              {title}
            </p>
            <p className={`text-2xl font-bold text-neutral-900 ${elderlyMode ? 'text-3xl' : ''}`}>
              {value}
            </p>
            {change && (
              <div className={`flex items-center mt-2 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
                <span className={changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {change}
                </span>
                <span className="text-neutral-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className={`h-6 w-6 text-white ${elderlyMode ? 'h-8 w-8' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <div 
      className="card cursor-pointer hover:shadow-medium transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="card-body">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${color} mr-4`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold text-neutral-900 ${elderlyMode ? 'text-lg' : ''}`}>
              {title}
            </h3>
            <p className={`text-neutral-600 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const RecentActivityItem = ({ activity, time, type }) => (
    <div className="flex items-center py-3 border-b border-neutral-200 last:border-b-0">
      <div className={`w-2 h-2 rounded-full mr-3 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'warning' ? 'bg-yellow-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      }`}></div>
      <div className="flex-1">
        <p className={`text-neutral-900 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
          {activity}
        </p>
        <p className={`text-neutral-500 ${elderlyMode ? 'text-sm' : 'text-xs'}`}>
          {time}
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const dashboardData = stats?.data || {};

  return (
    <div className={`space-y-6 ${elderlyMode ? 'space-y-8' : ''}`}>
      {/* Welcome Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold text-neutral-900 ${elderlyMode ? 'text-3xl' : ''}`}>
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className={`text-neutral-600 mt-1 ${elderlyMode ? 'text-lg' : ''}`}>
                Here's what's happening with AyurSutra today.
              </p>
            </div>
            <div className="text-right">
              <p className={`text-neutral-500 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardData.totalUsers || 0}
          icon={Users}
          color="bg-blue-500"
          change="+12%"
          changeType="positive"
        />
        <StatCard
          title="Active Doctors"
          value={dashboardData.activeDoctors || 0}
          icon={UserCheck}
          color="bg-green-500"
          change="+8%"
          changeType="positive"
        />
        <StatCard
          title="Today's Appointments"
          value={dashboardData.todayAppointments || 0}
          icon={Calendar}
          color="bg-purple-500"
          change="+15%"
          changeType="positive"
        />
        <StatCard
          title="Prescriptions Issued"
          value={dashboardData.prescriptionsIssued || 0}
          icon={FileText}
          color="bg-orange-500"
          change="+5%"
          changeType="positive"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="Verify Doctor"
          description="Review pending doctor verifications"
          icon={UserCheck}
          color="bg-blue-500"
          onClick={() => window.location.href = '/doctors?status=pending'}
        />
        <QuickActionCard
          title="View Appointments"
          description="Check today's appointment schedule"
          icon={Calendar}
          color="bg-green-500"
          onClick={() => window.location.href = '/appointments'}
        />
        <QuickActionCard
          title="Medicine Inventory"
          description="Check low stock medicines"
          icon={Pill}
          color="bg-yellow-500"
          onClick={() => window.location.href = '/medicines?filter=low-stock'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className={`font-semibold text-neutral-900 ${elderlyMode ? 'text-lg' : ''}`}>
              Recent Activity
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-0">
              <RecentActivityItem
                activity="New doctor registration: Dr. Priya Sharma"
                time="2 minutes ago"
                type="success"
              />
              <RecentActivityItem
                activity="Appointment completed: Patient ID #12345"
                time="15 minutes ago"
                type="success"
              />
              <RecentActivityItem
                activity="Prescription issued: RX2024001"
                time="1 hour ago"
                type="success"
              />
              <RecentActivityItem
                activity="Low stock alert: Ashwagandha tablets"
                time="2 hours ago"
                type="warning"
              />
              <RecentActivityItem
                activity="System backup completed"
                time="3 hours ago"
                type="success"
              />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <div className="card-header">
            <h3 className={`font-semibold text-neutral-900 ${elderlyMode ? 'text-lg' : ''}`}>
              System Status
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className={`text-neutral-700 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
                    Database Connection
                  </span>
                </div>
                <span className="badge badge-success">Healthy</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className={`text-neutral-700 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
                    API Services
                  </span>
                </div>
                <span className="badge badge-success">Operational</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className={`text-neutral-700 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
                    NDHM Integration
                  </span>
                </div>
                <span className="badge badge-success">Connected</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className={`text-neutral-700 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
                    SMS Service
                  </span>
                </div>
                <span className="badge badge-warning">Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="card">
        <div className="card-header">
          <h3 className={`font-semibold text-neutral-900 ${elderlyMode ? 'text-lg' : ''}`}>
            Government Compliance Status
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className={`font-semibold text-neutral-900 ${elderlyMode ? 'text-lg' : ''}`}>
                NDHM Compliant
              </h4>
              <p className={`text-neutral-600 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
                All health data standards met
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className={`font-semibold text-neutral-900 ${elderlyMode ? 'text-lg' : ''}`}>
                AYUSH Certified
              </h4>
              <p className={`text-neutral-600 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
                Ayurveda practices verified
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className={`font-semibold text-neutral-900 ${elderlyMode ? 'text-lg' : ''}`}>
                Data Security
              </h4>
              <p className={`text-neutral-600 ${elderlyMode ? 'text-base' : 'text-sm'}`}>
                End-to-end encryption enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;