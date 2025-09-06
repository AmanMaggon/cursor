import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { elderlyMode } = useTheme();
  const location = useLocation();

  return (
    <div className={`flex h-screen bg-neutral-50 ${elderlyMode ? 'elderly-mode' : ''}`}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          currentPath={location.pathname}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50">
          <div className="container-custom py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;