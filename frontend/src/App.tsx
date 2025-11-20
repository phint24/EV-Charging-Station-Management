import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { TopNav } from './components/layout/TopNav';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "./components/ui/sidebar";
import { SideNav, driverLinks, staffLinks, adminLinks } from "./components/layout/SideNav";
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { StationDetail } from './pages/driver/StationDetail';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import "./styles/globals.css"

import { apiGetDriverProfile } from './api/DriverAPI';
import { AuthResponse } from './types';
import { jwtDecode } from 'jwt-decode';
import { setAuthToken } from "./api/api";

import { ProfilePage } from './pages/driver/ProfilePage';

type ApiRole = 'ROLE_ADMIN' | 'ROLE_CSSTAFF' | 'ROLE_EVDRIVER';

interface CurrentUser {
  email: string;
  role: ApiRole;
  name: string;
  walletBalance: number;
}

const normalizeRole = (apiRole: ApiRole): ApiRole => {
  if (apiRole === 'ROLE_EVDRIVER') return 'ROLE_EVDRIVER';
  if (apiRole === 'ROLE_CSSTAFF') return 'ROLE_CSSTAFF';
  if (apiRole === 'ROLE_ADMIN') return 'ROLE_ADMIN';
  return 'ROLE_EVDRIVER';
};

function DashboardFallback({ role, onLogout }: { role: ApiRole, onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Chào mừng, {role.replace('ROLE_', '').toLowerCase()}!</h1>
        <p className="mb-6">Bạn đã đăng nhập thành công.</p>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setAuthToken(token);
          const decodedToken: { sub: string, roles: ApiRole[] } = jwtDecode(token);
          console.log("Role from server: ", decodedToken.roles);
          const userRole = normalizeRole(decodedToken.roles[0]);
          let userName = decodedToken.sub;
          let walletBalance = 0;

          if (userRole === 'ROLE_EVDRIVER') {
            try {
              const profile = await apiGetDriverProfile();
              userName = profile.userAccount.name;
              walletBalance = profile.walletBalance;
            } catch (profileError) {
              console.error("Failed to fetch driver profile on load:", profileError);
            }
          }

          setCurrentUser({
            email: decodedToken.sub,
            role: userRole,
            name: userName,
            walletBalance: walletBalance,
          });

          if (userRole === 'ROLE_EVDRIVER') setCurrentPath('/driver/dashboard');
          else if (userRole === 'ROLE_CSSTAFF') setCurrentPath('/staff/dashboard');
          else if (userRole === 'ROLE_ADMIN') setCurrentPath('/admin/dashboard');

        } catch (error) {
          console.error("Token không hợp lệ hoặc đã hết hạn:", error);
          setAuthToken(null);
          localStorage.removeItem('role');
        }
      }
      setIsAppLoading(false);
    };
    loadUserFromToken();
  }, []);

  const handleNavigate = (path: string) => {
    if (path === '/driver/wallet') {
      setIsWalletDialogOpen(true);
      return;
    }
    setCurrentPath(path);
  };

  const handleLogin = (authData: AuthResponse) => {
    const apiRole = normalizeRole(authData.role);

    setCurrentUser({
      email: authData.email,
      role: apiRole,
      name: authData.email,
      walletBalance: 0,
    });

    localStorage.setItem('role', apiRole);

    if (apiRole === 'ROLE_EVDRIVER') {
      setCurrentPath('/driver/dashboard');
    } else if (apiRole === 'ROLE_CSSTAFF') {
      setCurrentPath('/staff/dashboard');
    } else if (apiRole === 'ROLE_ADMIN') {
      setCurrentPath('/admin/dashboard');
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('role');
    setCurrentUser(null);
    setCurrentPath('/');
  };

  const getNavLinks = () => {
    if (!currentUser) return [];
    switch (currentUser.role) {
      case 'ROLE_EVDRIVER': return driverLinks;
      case 'ROLE_CSSTAFF': return staffLinks;
      case 'ROLE_ADMIN': return adminLinks;
      default: return [];
    }
  };

  const renderPage = () => {
    if (!currentUser) {
      if (currentPath === '/auth/register') {
        return <Register onRegister={handleLogin} onNavigate={handleNavigate} />;
      }
      if (currentPath === '/auth/login') {
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      }
      return <Landing onNavigate={handleNavigate} />;
    }
      if (currentPath === '/driver/profile' && currentUser.role === 'ROLE_EVDRIVER') {
    return <ProfilePage onNavigate={handleNavigate} />;
  }

    if (currentPath.startsWith('/driver/station/')) {
      const stationId = parseInt(currentPath.split('/').pop() || '0');
      return <StationDetail stationId={stationId} onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/driver') && currentUser.role === 'ROLE_EVDRIVER') {
      return (
        <DriverDashboard
          onNavigate={handleNavigate}
          isWalletDialogOpen={isWalletDialogOpen}
          onWalletDialogChange={setIsWalletDialogOpen}
        />
      );
    }

    if (currentPath.startsWith('/staff') && currentUser.role === 'ROLE_CSSTAFF') {
      return <StaffDashboard onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/admin') && currentUser.role === 'ROLE_ADMIN') {
      return <AdminDashboard onNavigate={handleNavigate} />;
    }

    if (currentUser.role === 'ROLE_EVDRIVER') return <DriverDashboard onNavigate={handleNavigate} isWalletDialogOpen={isWalletDialogOpen} onWalletDialogChange={setIsWalletDialogOpen} />;
    if (currentUser.role === 'ROLE_CSSTAFF') return <StaffDashboard onNavigate={handleNavigate} />;
    if (currentUser.role === 'ROLE_ADMIN') return <AdminDashboard onNavigate={handleNavigate} />;

    return <DashboardFallback role={currentUser.role} onLogout={handleLogout} />;
  };

  if (isAppLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải ứng dụng...</p>
      </div>
    );
  }

  // Custom Sidebar Content sử dụng component SideNav cũ
  const CustomSidebarContent = () => {
    const links = getNavLinks();
    
    return (
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === link.path}
                    onClick={() => handleNavigate(link.path)}
                  >
                    <a href={link.path} className="flex items-center gap-3">
                      {link.icon}
                      <span>{link.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    );
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50">
      <Toaster position="top-right" richColors />

      {!currentUser ? (
        <div className="h-full">{renderPage()}</div>
      ) : (
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <CustomSidebarContent />
          </Sidebar>

          <SidebarInset>
            {/* Header */}
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold"> </h1>
              </div>
              <TopNav
                userRole={currentUser.role}
                userName={currentUser.name}
                walletBalance={currentUser.role === 'ROLE_EVDRIVER' ? currentUser.walletBalance : undefined}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            </header>

            {/* Main content - QUAN TRỌNG: overflow-auto cho phép cuộn */}
            <main className="flex-1 overflow-auto p-6">
              {renderPage()}
            </main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </div>
  );
}