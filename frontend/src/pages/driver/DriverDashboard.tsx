

import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { StationsMap } from '../../components/station/StationsMap';
import { StationCard } from '../../components/station/StationCard';
import { ChargingSessionPanel } from '../../components/charging/ChargingSessionPanel';
import { WalletPanel } from '../../components/payment/WalletPanel';
import { QRScannerButton } from '../../components/shared/QRScannerButton';
import { sampleStations, activeSession, currentUser } from '../../data/sample';
import { Zap, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import "../../styles/globals.css"
interface DriverDashboardProps {
  onNavigate: (path: string) => void;
  isWalletDialogOpen?: boolean; // ← THÊM DÒNG NÀY
  onWalletDialogChange?: (open: boolean) => void; // ← THÊM DÒNG NÀY
}

export function DriverDashboard({ onNavigate, isWalletDialogOpen, onWalletDialogChange }: DriverDashboardProps) {
  const [hasActiveSession] = useState(true); // Demo: set to true to show active session
  const [walletBalance, setWalletBalance] = useState(currentUser.walletBalance);

  const handleStationClick = (stationId: string) => {
    onNavigate(`/driver/station/${stationId}`);
  };

  const handleStopCharging = () => {
    toast.success('Charging session stopped successfully');
    // In production: API call to stop session
  };

  const handleTopUp = (amount: number, method: string) => {
    setWalletBalance((prev) => prev + amount);
    toast.success(`Added ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)} to wallet`);
    // In production: API call POST /wallet/topup
  };

  const handleQRScan = (stationId: string) => {
    toast.success('Station found via QR code');
    onNavigate(`/driver/station/${stationId}`);
  };

  // Mock charging statistics
  const stats = [
    {
      icon: <Zap className="h-5 w-5" />,
      label: 'Total Sessions',
      value: '47',
      change: '+12% this month',
      color: 'text-[#0f766e]',
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Energy Consumed',
      value: '1,245 kWh',
      change: '+8% this month',
      color: 'text-blue-600',
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: 'Total Spent',
      value: '5,602,500 ₫',
      change: '-5% this month',
      color: 'text-green-600',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: 'Avg. Session',
      value: '38 min',
      change: '-3 min',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1>Welcome back, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-gray-600">Track your charging activity and find nearby stations</p>
        </div>
        <QRScannerButton onScan={handleQRScan} />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Map and Stations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Charging Session */}
          {hasActiveSession && (
            <ChargingSessionPanel session={activeSession} onStop={handleStopCharging} />
          )}

          {/* Map */}
          <Card className="p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2>Nearby Stations</h2>
              <Badge variant="outline">{sampleStations.length} stations</Badge>
            </div>
            <div className="h-[400px]">
              <StationsMap stations={sampleStations} onStationClick={handleStationClick} />
            </div>
          </Card>

          {/* Station List */}
          <div>
            <h2 className="mb-4">Available Stations</h2>
            <div className="space-y-4">
              {sampleStations.slice(0, 3).map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  onClick={() => handleStationClick(station.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Wallet and Quick Actions */}
        <div className="space-y-6">
          {/* Wallet */}
          <WalletPanel 
          balance={walletBalance} 
          onTopUp={handleTopUp} 
          isOpen={isWalletDialogOpen}              // ← THÊM DÒNG NÀY
          onOpenChange={onWalletDialogChange}      // ← THÊM DÒNG NÀY
          />

          {/* Subscription */}
          <Card className="p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3>Current Plan</h3>
              <Badge className="bg-purple-500">Premium</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You're saving 10% on every charge
            </p>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />
                Priority booking
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />
                24/7 support
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />
                Free parking at stations
              </li>
            </ul>
            <p className="text-xs text-gray-500">Renews on Nov 1, 2025</p>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 rounded-2xl">
            <h3 className="mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Charging completed</p>
                  <p className="text-xs text-gray-500">Central Plaza • 32.5 kWh</p>
                </div>
                <p className="text-sm">146,250₫</p>
              </div>
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Wallet top-up</p>
                  <p className="text-xs text-gray-500">Via bank transfer</p>
                </div>
                <p className="text-sm text-green-600">+500,000₫</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Plan renewed</p>
                  <p className="text-xs text-gray-500">Premium monthly</p>
                </div>
                <p className="text-sm">299,000₫</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
