import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  Calendar, 
  FileText, 
  Pill, 
  BarChart3, 
  Settings, 
  User,
  X,
  Shield,
  Activity,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, hasRole } = useAuth();
  const { elderlyMode } = useTheme();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'doctor', 'chemist']
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: ['admin']
    },
    {
      name: 'Doctors',
      href: '/doctors',
      icon: UserCheck,
      roles: ['admin']
    },
    {
      name: 'Chemists',
      href: '/chemists',
      icon: Building2,
      roles: ['admin']
    },
    {
      name: 'Appointments',
      href: '/appointments',
      icon: Calendar,
      roles: ['admin', 'doctor']
    },
    {
      name: 'Prescriptions',
      href: '/prescriptions',
      icon: FileText,
      roles: ['admin', 'doctor', 'chemist']
    },
    {
      name: 'Medicines',
      href: '/medicines',
      icon: Pill,
      roles: ['admin', 'chemist']
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['admin']
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['admin']
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      roles: ['admin', 'doctor', 'chemist']
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive
              ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`
        }
        onClick={onClose}
      >
        <item.icon
          className={`mr-3 h-5 w-5 flex-shrink-0 ${
            location.pathname === item.href
              ? 'text-primary-600'
              : 'text-neutral-400 group-hover:text-neutral-500'
          }`}
        />
        <span className={elderlyMode ? 'text-lg' : ''}>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-900 bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                <span className="text-white font-bold text-lg">🌿</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-neutral-900">AyurSutra</h1>
                <p className="text-xs text-neutral-500">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-neutral-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-neutral-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-200">
            <div className="flex items-center text-xs text-neutral-500">
              <Shield className="h-4 w-4 mr-2" />
              <span>Government Compliant</span>
            </div>
            <div className="flex items-center text-xs text-neutral-500 mt-1">
              <Activity className="h-4 w-4 mr-2" />
              <span>NDHM Certified</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;