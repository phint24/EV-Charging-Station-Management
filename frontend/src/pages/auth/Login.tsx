import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import "../../styles/globals.css";

import { apiLogin, setAuthToken, AuthResponse } from '../../services/AuthAPI';
import axios from 'axios';

type ApiRole = 'ROLE_ADMIN' | 'ROLE_CSSTAFF' | 'ROLE_EVDRIVER';
type AppRole = 'driver' | 'staff' | 'admin';

const normalizeRole = (apiRole: ApiRole): AppRole => {
    if (apiRole === 'ROLE_EVDRIVER') return 'driver';
    if (apiRole === 'ROLE_CSSTAFF') return 'staff';
    if (apiRole === 'ROLE_ADMIN') return 'admin';
    return 'driver'; // Mặc định
};

interface LoginProps {
    onLogin: (role: AppRole) => void;
    onNavigate: (path: string) => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const performLogin = async (loginEmail: string, loginPassword: string) => {
        setIsLoading(true);
        try {
            const response = await apiLogin(loginEmail, loginPassword);
            setAuthToken(response.token);
            const appRole = normalizeRole(response.role);
            toast.success(`Đăng nhập thành công với vai trò ${appRole}!`);
            onLogin(appRole);

        } catch (error) {
            console.error('Login failed:', error);
            let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    errorMessage = error.response.data?.message ||
                        (error.response.status === 403 ? 'Sai email hoặc mật khẩu' : 'Lỗi từ máy chủ.');
                } else if (error.request) {
                    errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.';
                } else {
                    errorMessage = error.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Vui lòng nhập email và mật khẩu');
            return;
        }
        performLogin(email, password);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f766e] to-[#0ea5a4] flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 rounded-2xl">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f766e] mb-4">
                        <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="mb-2">Welcome Back</h2>
                    <p className="text-gray-600 text-center">Sign in to your EV Charge account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="text-[#0f766e] hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#0f766e] hover:bg-[#0f766e]/90"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <a
                        href="#"
                        className="text-[#0f766e] hover:underline"
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isLoading) onNavigate('/auth/register');
                        }}
                    >
                        Sign up
                    </a>
                </p>
            </Card>
        </div>
    );
}