import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Eye,
  EyeOff,
  Globe,
  Type
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useQuery } from 'react-query';
import { notificationsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Header = ({ onMenuClick, currentPath }) => {
  const { user, logout } = useAuth();
  const { 
    theme, 
    toggleTheme, 
    elderlyMode, 
    toggleElderlyMode,
    highContrast,
    toggleHighContrast,
    language,
    setLanguage,
    fontSize,
    setFontSize
  } = useTheme();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Fetch notifications
  const { data: notifications } = useQuery(
    'notifications',
    () => notificationsAPI.getNotifications({ limit: 5 }),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const unreadCount = notifications?.data?.filter(n => !n.read).length || 0;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getPageTitle = (path) => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/users': 'Users',
      '/doctors': 'Doctors',
      '/chemists': 'Chemists',
      '/appointments': 'Appointments',
      '/prescriptions': 'Prescriptions',
      '/medicines': 'Medicines',
      '/analytics': 'Analytics',
      '/settings': 'Settings',
      '/profile': 'Profile'
    };
    return titles[path] || 'AyurSutra';
  };

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="ml-4">
            <h1 className="text-xl font-semibold text-neutral-900">
              {getPageTitle(currentPath)}
            </h1>
            <p className="text-sm text-neutral-500">
              Welcome back, {user?.firstName}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-md text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100"
              title="Accessibility Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            {showSettings && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-neutral-900 mb-3">
                    Accessibility Settings
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Theme</span>
                      <button
                        onClick={toggleTheme}
                        className="flex items-center space-x-2 text-sm"
                      >
                        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
                      </button>
                    </div>

                    {/* Elderly Mode */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Elderly Mode</span>
                      <button
                        onClick={toggleElderlyMode}
                        className="flex items-center space-x-2 text-sm"
                      >
                        {elderlyMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{elderlyMode ? 'Off' : 'On'}</span>
                      </button>
                    </div>

                    {/* High Contrast */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">High Contrast</span>
                      <button
                        onClick={toggleHighContrast}
                        className="flex items-center space-x-2 text-sm"
                      >
                        {highContrast ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{highContrast ? 'Off' : 'On'}</span>
                      </button>
                    </div>

                    {/* Font Size */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Font Size</span>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="text-sm border border-neutral-300 rounded px-2 py-1"
                      >
                        <option value="normal">Normal</option>
                        <option value="large">Large</option>
                        <option value="extra-large">Extra Large</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Language</span>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-sm border border-neutral-300 rounded px-2 py-1"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिन्दी</option>
                        <option value="ta">தமிழ்</option>
                        <option value="te">తెలుగు</option>
                        <option value="bn">বাংলা</option>
                        <option value="gu">ગુજરાતી</option>
                        <option value="mr">मराठी</option>
                        <option value="pa">ਪੰਜਾਬੀ</option>
                        <option value="or">ଓଡ଼ିଆ</option>
                        <option value="as">অসমীয়া</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-md text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600" />
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.firstName}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-neutral-200">
                    <p className="text-sm font-medium text-neutral-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-neutral-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowSettings(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;