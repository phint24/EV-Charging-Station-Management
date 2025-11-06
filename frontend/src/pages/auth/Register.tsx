import { useState } from 'react';
import { Zap, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import "../../styles/globals.css";

import { apiRegister, setAuthToken, AuthResponse } from '../../services/AuthAPI';
import axios from 'axios';

type ApiRole = 'ROLE_ADMIN' | 'ROLE_CSSTAFF' | 'ROLE_EVDRIVER';
type AppRole = 'driver' | 'staff' | 'admin';
const normalizeRole = (apiRole: ApiRole): AppRole => {
    if (apiRole === 'ROLE_EVDRIVER') return 'driver';
    if (apiRole === 'ROLE_CSSTAFF') return 'staff';
    if (apiRole === 'ROLE_ADMIN') return 'admin';
    return 'driver';
};

interface RegisterProps {
    onRegister: (role: AppRole) => void;
    onNavigate: (path: string) => void;
}

export function Register({ onRegister, onNavigate }: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiRegister(name, email, password);

            setAuthToken(response.token);

            const appRole = normalizeRole(response.role);

            toast.success('Đăng ký thành công! Đang đăng nhập...');
            onRegister(appRole);

        } catch (error) {
            console.error('Registration failed:', error);

            let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    errorMessage = error.response.data?.message || 'Lỗi từ máy chủ.';
                } else if (error.request) {
                    errorMessage = 'Không thể kết nối đến máy chủ.';
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f766e] to-[#0ea5a4] flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 rounded-2xl">
                <a
                    href="#"
                    className="flex items-center text-sm text-gray-600 hover:text-[#0f766e] mb-4"
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isLoading) onNavigate('/auth/login');
                    }}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to login
                </a>

                <div className="flex flex-col items-center mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f766e] mb-4">
                        <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="mb-2">Create an Account</h2>
                    <p className="text-gray-600 text-center">Start your EV journey with us</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            autoComplete="name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="•••••••• (Ít nhất 6 ký tự)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#0f766e] hover:bg-[#0f766e]/90"
                        size="lg"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang tạo tài khoản...' : 'Sign Up'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}