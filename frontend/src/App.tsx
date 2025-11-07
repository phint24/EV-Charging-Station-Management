/**
 * Main App Component
 * Handles routing and application state
 * 
 * Routes:
 * - / : Landing page
 * - /auth/login : Login page
 * - /driver/dashboard : Driver dashboard
 * - /staff/dashboard : Staff dashboard
 * - /admin/dashboard : Admin dashboard
 */

import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { TopNav } from './components/layout/TopNav';
import { SideNav, driverLinks, staffLinks, adminLinks } from "./components/layout/SideNav"
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { StationDetail } from './pages/driver/StationDetail';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { currentUser } from './data/sample';
import "./styles/globals.css"

type UserRole = 'driver' | 'staff' | 'admin' | null;

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const [walletBalance] = useState(currentUser.walletBalance);

  const handleNavigate = (path:any) => {
    setCurrentPath(path);

    // Auto-detect role from path for demo purposes
    if (path.startsWith('/driver')) {
      setUserRole('driver');
    } else if (path.startsWith('/staff')) {
      setUserRole('staff');
    } else if (path.startsWith('/admin')) {
      setUserRole('admin');
    }
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    // Navigate to appropriate dashboard based on role
    if (role === 'driver') {
      setCurrentPath('/driver/dashboard');
    } else if (role === 'staff') {
      setCurrentPath('/staff/dashboard');
    } else if (role === 'admin') {
      setCurrentPath('/admin/dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPath('/');
  };

  // Determine if we should show navigation
  const showNav = userRole && !currentPath.startsWith('/auth') && currentPath !== '/';

  // Get navigation links based on role
  const getNavLinks = () => {
    switch (userRole) {
      case 'driver':
        return driverLinks;
      case 'staff':
        return staffLinks;
      case 'admin':
        return adminLinks;
      default:
        return [];
    }
  };

  // Render page based on current path
  const renderPage = () => {
    // Auth pages
    if (currentPath === '/auth/login' || currentPath === '/auth/register') {
      return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
    }

    // Landing page
    if (currentPath === '/') {
      return <Landing onNavigate={handleNavigate} />;
    }

    // Driver pages
    if (currentPath.startsWith('/driver/station/')) {
      const stationId = currentPath.split('/').pop() || '';
      return <StationDetail stationId={stationId} onNavigate={handleNavigate} />;
    }
    
    if (currentPath.startsWith('/driver')) {
      return <DriverDashboard onNavigate={handleNavigate} />;
    }

    // Staff pages
    if (currentPath.startsWith('/staff')) {
      return <StaffDashboard onNavigate={handleNavigate} />;
    }

    // Admin pages
    if (currentPath.startsWith('/admin')) {
      return <AdminDashboard onNavigate={handleNavigate} />;
    }

    // Default to landing
    return <Landing onNavigate={handleNavigate} />;
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50">
      {/* Top Navigation */}
      {showNav && (
        <TopNav
          userRole={userRole!}
          userName={currentUser.name}
          walletBalance={userRole === 'driver' ? walletBalance : undefined}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      <div className="flex h-full">
        {/* Side Navigation */}
        {showNav && (
          <SideNav
            links={getNavLinks()}
            collapsed={sideNavCollapsed}
            currentPath={currentPath}
            onNavigate={handleNavigate}
            onToggleCollapse={() => setSideNavCollapsed(!sideNavCollapsed)}
          />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto ${
            showNav
              ? sideNavCollapsed
                ? 'ml-16 mt-16'
                : 'ml-64 mt-16'
              : ''
          } transition-all duration-300`}
        >
          <div className={showNav ? 'p-6' : ''}>
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
