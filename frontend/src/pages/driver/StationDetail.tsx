

import { useState } from 'react';
import { ArrowLeft, MapPin, Star, Zap, Clock, DollarSign, Navigation, Phone, Wifi, Coffee, Utensils } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BookingModal } from '../../components/booking/BookingModal';
import { sampleStations } from '../../data/sample';
import { toast } from 'sonner';
import "../../styles/globals.css"
interface StationDetailProps {
  stationId: string;
  onNavigate: (path: string) => void;
}

export function StationDetail({ stationId, onNavigate }: StationDetailProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Find station by ID
  const station = sampleStations.find((s) => s.id === stationId) || sampleStations[0];

  const handleBookingConfirm = (portId: string, startTime: Date) => {
    toast.success(`Booking confirmed for ${portId} at ${startTime.toLocaleTimeString()}`);
    // API: POST /bookings { stationId, portId, startTime }
    onNavigate('/driver/dashboard');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getPortStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'occupied':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'offline':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const amenityIcons: Record<string, React.ReactNode> = {
    'WiFi': <Wifi className="h-4 w-4" />,
    'Coffee Shop': <Coffee className="h-4 w-4" />,
    'Restaurant': <Utensils className="h-4 w-4" />,
    'Restroom': <Coffee className="h-4 w-4" />,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => onNavigate('/driver/dashboard')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Station Info */}
          <Card className="p-6 rounded-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="mb-2">{station.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{station.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{station.rating}</span>
                  </div>
                  {station.distance !== undefined && (
                    <div className="flex items-center gap-1">
                      <Navigation className="h-4 w-4 text-[#0f766e]" />
                      <span>{station.distance} km away</span>
                    </div>
                  )}
                  <Badge
                    className={
                      station.status === 'online'
                        ? 'bg-green-500'
                        : station.status === 'offline'
                        ? 'bg-red-500'
                        : 'bg-orange-500'
                    }
                  >
                    {station.status}
                  </Badge>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-[#0f766e] hover:bg-[#0f766e]/90"
                onClick={() => setIsBookingOpen(true)}
                disabled={station.availablePorts === 0}
              >
                Book Now
              </Button>
            </div>
          </Card>

          {/* Charging Ports */}
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2>Available Ports</h2>
              <Badge variant="outline">
                {station.availablePorts}/{station.totalPorts} available
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {station.ports.map((port) => (
                <Card
                  key={port.id}
                  className={`p-4 rounded-xl border-2 ${
                    port.status === 'available'
                      ? 'border-green-200 bg-green-50/30'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#0f766e]" />
                      <span className="font-medium">{port.type}</span>
                    </div>
                    <Badge variant="outline" className={getPortStatusColor(port.status)}>
                      {port.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Power Output</span>
                      <span className="font-medium text-gray-900">{port.power} kW</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Est. Charge Time</span>
                      <span className="font-medium text-gray-900">
                        {Math.round((80 / port.power) * 60)} min
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Amenities */}
          <Card className="p-6 rounded-2xl">
            <h2 className="mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {station.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                >
                  {amenityIcons[amenity] || <Coffee className="h-4 w-4" />}
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#0ea5a4] text-white">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5" />
              <h3 className="text-white">Pricing</h3>
            </div>
            <p className="text-3xl mb-2">{formatCurrency(station.pricePerKwh)}</p>
            <p className="text-sm text-white/80 mb-4">per kWh</p>
            <div className="bg-white/10 rounded-xl p-3 text-sm">
              <p className="mb-1">Estimated cost for 50 kWh:</p>
              <p className="text-xl">{formatCurrency(station.pricePerKwh * 50)}</p>
            </div>
          </Card>

          {/* Operating Hours */}
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-[#0f766e]" />
              <h3>Operating Hours</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday</span>
                <span>24/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday - Sunday</span>
                <span>24/7</span>
              </div>
            </div>
            <Badge className="mt-4 bg-green-500 w-full justify-center">
              Open Now
            </Badge>
          </Card>

          {/* Contact */}
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-[#0f766e]" />
              <h3>Contact</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">Station Hotline</p>
              <p>1800-8888</p>
              <p className="text-gray-600 mt-3">Emergency Support</p>
              <p>1900-1234</p>
            </div>
          </Card>

          {/* Directions */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.info('Opening directions in maps...')}
          >
            <Navigation className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        station={station}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
}
