/**
 * Login Page
 * Authentication page for users to log in
 */

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import "../../styles/globals.css"
interface LoginProps {
  onLogin: (role: 'driver' | 'staff' | 'admin') => void;
  onNavigate: (path: string) => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    // Mock login - in production, validate with API
    // For demo: any email/password works
    toast.success('Login successful!');
    
    // Default to driver role for demo
    onLogin('driver');
  };

  // Quick login buttons for demo
  const handleQuickLogin = (role: 'driver' | 'staff' | 'admin') => {
    toast.success(`Logged in as ${role}`);
    onLogin(role);
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
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Demo Quick Login</span>
          </div>
        </div>

        {/* Quick Login Buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleQuickLogin('driver')}
          >
            Login as Driver
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleQuickLogin('staff')}
          >
            Login as Staff
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleQuickLogin('admin')}
          >
            Login as Admin
          </Button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <a
            href="#"
            className="text-[#0f766e] hover:underline"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/auth/register');
            }}
          >
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
}
