import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { TopNav } from './components/layout/TopNav';
import { SideNav, driverLinks, staffLinks, adminLinks } from "./components/layout/SideNav"
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { StationDetail } from './pages/driver/StationDetail';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import "./styles/globals.css"

import { setAuthToken } from './services/api';
import { jwtDecode } from 'jwt-decode';
import {AuthResponse} from "./types";
import {apiGetDriverProfile} from "./services/DriverAPI";

type ApiRole = 'ROLE_ADMIN' | 'ROLE_CSSTAFF' | 'ROLE_EVDRIVER';
type AppRole = 'driver' | 'staff' | 'admin';

interface CurrentUser {
    email: string;
    role: AppRole;
    name: string;
    walletBalance: number;
}

const normalizeRole = (apiRole: ApiRole): AppRole => {
    if (apiRole === 'ROLE_EVDRIVER') return 'driver';
    if (apiRole === 'ROLE_CSSTAFF') return 'staff';
    if (apiRole === 'ROLE_ADMIN') return 'admin';
    return 'driver';
};

function DashboardFallback({ role, onLogout }: { role: AppRole, onLogout: () => void }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Chào mừng, {role}!
                </h1>
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
    const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
    const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        const loadUserFromToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    setAuthToken(token);
                    const decodedToken: { sub: string, roles: ApiRole[] } = jwtDecode(token);

                    const userRole = normalizeRole(decodedToken.roles[0]);
                    let userName = decodedToken.sub;
                    let walletBalance = 0;

                    if (userRole === 'driver') {
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

                    setCurrentPath(`/${userRole}/dashboard`);

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
        const appRole = normalizeRole(authData.role);

        setCurrentUser({
            email: authData.email,
            role: appRole,
            name: authData.email, // Tên tạm thời, sẽ được cập nhật khi dashboard tải
            walletBalance: 0,
        });

        localStorage.setItem('role', appRole);

        if (appRole === 'driver') {
            setCurrentPath('/driver/dashboard');
        } else if (appRole === 'staff') {
            setCurrentPath('/staff/dashboard');
        } else if (appRole === 'admin') {
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
            case 'driver': return driverLinks;
            case 'staff': return staffLinks;
            case 'admin': return adminLinks;
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

        if (currentPath.startsWith('/driver/station/')) {
            const stationId = parseInt(currentPath.split('/').pop() || '0');
            return <StationDetail stationId={stationId} onNavigate={handleNavigate} />;
        }

        if (currentPath.startsWith('/driver')) {
            return (
                <DriverDashboard
                    onNavigate={handleNavigate}
                    isWalletDialogOpen={isWalletDialogOpen}
                    onWalletDialogChange={setIsWalletDialogOpen}
                />
            );
        }

        if (currentPath.startsWith('/staff')) {
            return <StaffDashboard onNavigate={handleNavigate} />;
        }

        if (currentPath.startsWith('/admin')) {
            return <AdminDashboard onNavigate={handleNavigate} />;
        }

        return <DashboardFallback role={currentUser.role} onLogout={handleLogout} />;
    };

    if (isAppLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Đang tải ứng dụng...</p>
            </div>
        );
    }

    const showNav = !!currentUser;

    return (
        <div className="h-screen w-full overflow-hidden bg-gray-50">
            {showNav && (
                <TopNav
                    userRole={currentUser.role}
                    userName={currentUser.name}
                    walletBalance={currentUser.role === 'driver' ? currentUser.walletBalance : undefined}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                />
            )}

            <div className="flex h-full">
                {showNav && (
                    <SideNav
                        links={getNavLinks()}
                        collapsed={sideNavCollapsed}
                        currentPath={currentPath}
                        onNavigate={handleNavigate}
                        onToggleCollapse={() => setSideNavCollapsed(!sideNavCollapsed)}
                    />
                )}

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

            <Toaster position="top-right" richColors />
        </div>
    );
}