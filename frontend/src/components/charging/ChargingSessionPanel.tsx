/**
 * ChargingSessionPanel Component
 * Props:
 * - session: ChargingSession object with soc, timeRemaining, kWhUsed, cost
 * - onStop: () => void - Handler to stop charging session
 * 
 * Displays active charging session with real-time updates
 */

import { useEffect, useState } from 'react';
import { Zap, Clock, DollarSign, Battery, StopCircle, MapPin } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { ChargingSession } from '../../data/sample';
import "../../styles/globals.css"

interface ChargingSessionPanelProps {
  session: ChargingSession;
  onStop: () => void;
}

export function ChargingSessionPanel({ session, onStop }: ChargingSessionPanelProps) {
  const [currentSoc, setCurrentSoc] = useState(session.soc);
  const [currentKwh, setCurrentKwh] = useState(session.kWhUsed);
  const [currentCost, setCurrentCost] = useState(session.cost);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Simulate charging progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSoc((prev:any) => Math.min(prev + 0.5, 100));
      setCurrentKwh((prev:any) => prev + 0.3);
      setCurrentCost((prev:any) => prev + 1350);
      setElapsedTime((prev) => prev + 1);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeRemaining = () => {
    if (!session.timeRemaining) return 'Calculating...';
    const remaining = Math.max(session.timeRemaining - Math.floor(elapsedTime / 60), 0);
    return `${remaining} min`;
  };

  return (
    <Card className="p-6 rounded-2xl shadow-lg border-2 border-[#0f766e]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-green-500">Active</Badge>
            <Badge variant="outline">{session.portType}</Badge>
          </div>
          <h3>Charging in Progress</h3>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{session.stationName}</span>
          </div>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0f766e] animate-pulse">
          <Zap className="h-8 w-8 text-white fill-white" />
        </div>
      </div>

      {/* State of Charge */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Battery className="h-5 w-5 text-[#0f766e]" />
            <span>Battery Level</span>
          </div>
          <span className="text-2xl">{Math.round(currentSoc)}%</span>
        </div>
        <Progress value={currentSoc} className="h-3" />
        <p className="text-sm text-gray-600 mt-1">
          {100 - Math.round(currentSoc)}% to full charge
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Energy Used */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-[#0f766e]" />
            <span className="text-sm text-gray-600">Energy Used</span>
          </div>
          <p className="text-xl">{currentKwh.toFixed(2)} kWh</p>
        </div>

        {/* Time Elapsed */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-[#0f766e]" />
            <span className="text-sm text-gray-600">Time Elapsed</span>
          </div>
          <p className="text-xl">{formatDuration(elapsedTime)}</p>
        </div>

        {/* Current Cost */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-[#0f766e]" />
            <span className="text-sm text-gray-600">Current Cost</span>
          </div>
          <p className="text-xl">{formatCurrency(currentCost)}</p>
        </div>

        {/* Time Remaining */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-[#0f766e]" />
            <span className="text-sm text-gray-600">Est. Remaining</span>
          </div>
          <p className="text-xl">{getTimeRemaining()}</p>
        </div>
      </div>

      {/* Stop Button */}
      <Button
        onClick={onStop}
        variant="destructive"
        className="w-full"
        size="lg"
      >
        <StopCircle className="mr-2 h-5 w-5" />
        Stop Charging
      </Button>

      {/* Info Note */}
      <p className="text-xs text-gray-500 text-center mt-3">
        You can stop charging at any time. Final cost will be calculated based on actual usage.
      </p>
    </Card>
  );
}
