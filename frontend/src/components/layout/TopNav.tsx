import { Bell, User, LogOut, Wallet } from 'lucide-react';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import "../../styles/globals.css"
import { useState, useEffect } from 'react';

// (1) Import API (Đã đúng)
import { apiGetBalance } from '../../services/DriverAPI';

// (2) SỬA LỖI CHÍNH TẢ: 'ROlE...' -> 'ROLE...'
interface TopNavProps {
    userRole: 'ROLE_EVDRIVER' | 'ROLE_ADMIN' | 'ROLE_CSSTAFF';
    userName: string;
    onLogout: () => void;
    onNavigate: (path: string) => void;
}

export function TopNav({ userRole, userName, onLogout, onNavigate }: TopNavProps) {
    const [balance, setBalance] = useState<number | undefined>(undefined);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    useEffect(() => {
        if (userRole === 'ROLE_EVDRIVER') {
            const fetchBalance = async () => {
                try {
                    const data = await apiGetBalance();
                    setBalance(data.newBalance);
                } catch (error) {
                    console.error("Failed to fetch wallet balance:", error);
                    setBalance(undefined);
                }
            };

            fetchBalance();
        }
    }, [userRole]);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f766e]">
                        <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <span className="hidden md:block">EV Charge</span>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* (Phần này giờ sẽ hoạt động sau khi sửa lỗi) */}
                    {userRole === 'ROLE_EVDRIVER' && balance !== undefined && (
                        <Button
                            variant="ghost"
                            className="hidden md:flex items-center gap-2"
                            onClick={() => onNavigate('/driver/wallet')}
                        >
                            <Wallet className="h-4 w-4" />
                            <span>{formatCurrency(balance)}</span>
                        </Button>
                    )}

                    {/* Notifications (Vẫn đang là data cứng) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="h-5 w-5" />
                                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                                    3
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-80 overflow-y-auto">
                                <div className="px-2 py-2 hover:bg-gray-100 cursor-pointer rounded">
                                    <p className="text-sm">Charging completed at Central Plaza</p>
                                    <p className="text-xs text-gray-500">5 minutes ago</p>
                                </div>
                                <div className="px-2 py-2 hover:bg-gray-100 cursor-pointer rounded">
                                    <p className="text-sm">New station available near you</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                                <div className="px-2 py-2 hover:bg-gray-100 cursor-pointer rounded">
                                    <p className="text-sm">Wallet balance low</p>
                                    <p className="text-xs text-gray-500">1 day ago</p>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f766e] text-white">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="hidden md:block">{userName}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                <div>
                                    <p>{userName}</p>
                                    {/* (Hiển thị role đã chuẩn hóa) */}
                                    <p className="text-xs text-gray-500 capitalize">{userRole.replace('ROLE_', '').toLowerCase()}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onNavigate('/profile')}>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            {userRole === 'ROLE_EVDRIVER' && (
                                <DropdownMenuItem onClick={() => onNavigate('/driver/wallet')}>
                                    <Wallet className="mr-2 h-4 w-4" />
                                    Wallet
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs text-gray-500">Switch Role (Demo)</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onNavigate('/driver/dashboard')}>
                                Switch to Driver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onNavigate('/staff/dashboard')}>
                                Switch to Staff
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onNavigate('/admin/dashboard')}>
                                Switch to Admin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}