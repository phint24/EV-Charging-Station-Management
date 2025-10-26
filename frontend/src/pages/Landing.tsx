/**
 * Landing Page
 * Main landing page with overview, features, and CTA
 */

import { Zap, MapPin, Wallet, BarChart3, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface LandingProps {
  onNavigate: (path: string) => void;
}

export function Landing({ onNavigate }: LandingProps) {
  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Find Stations',
      description: 'Locate nearby charging stations with real-time availability',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Fast Charging',
      description: 'Up to 350kW ultra-fast charging at selected locations',
    },
    {
      icon: <Wallet className="h-8 w-8" />,
      title: 'Easy Payment',
      description: 'Multiple payment options with transparent pricing',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Service',
      description: 'Access charging stations anytime, anywhere',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Usage Analytics',
      description: 'Track your charging habits and optimize costs',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Safe',
      description: 'Certified stations with safety monitoring',
    },
  ];

  const stats = [
    { value: '500+', label: 'Charging Stations' },
    { value: '2000+', label: 'Charging Ports' },
    { value: '50K+', label: 'Active Users' },
    { value: '1M+', label: 'Charging Sessions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f766e]">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl">EV Charge</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => onNavigate('/auth/login')}>
                Login
              </Button>
              <Button
                className="bg-[#0f766e] hover:bg-[#0f766e]/90"
                onClick={() => onNavigate('/auth/register')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6">
            Power Your Journey with
            <span className="block text-[#0f766e] mt-2">Smart EV Charging</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join Vietnam's largest electric vehicle charging network. Find stations, charge fast,
            and manage everything from one simple platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#0f766e] hover:bg-[#0f766e]/90"
              onClick={() => onNavigate('/driver/dashboard')}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Find Stations Near You
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('/auth/register')}
            >
              Get Started Free
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center rounded-2xl">
              <p className="text-3xl text-[#0f766e] mb-2">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Why Choose EV Charge?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for a seamless electric vehicle charging experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="p-6 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f766e]/10 text-[#0f766e] mb-4">
                  {feature.icon}
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#0ea5a4] text-white text-center">
            <h2 className="mb-4 text-white">Ready to Go Electric?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of drivers making the switch to clean energy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#0f766e] hover:bg-white/90"
                onClick={() => onNavigate('/auth/register')}
              >
                Create Free Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => onNavigate('/driver/dashboard')}
              >
                Explore Stations
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0f766e]">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span>EV Charge</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 EV Charge. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-gray-600">
              <a href="#" className="hover:text-[#0f766e]">Privacy</a>
              <a href="#" className="hover:text-[#0f766e]">Terms</a>
              <a href="#" className="hover:text-[#0f766e]">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
