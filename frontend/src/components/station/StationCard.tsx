/**
 * StationCard Component
 * Props:
 * - station: Station object with name, distance, status, ports, power, pricePerKwh
 * - onClick: () => void - Handler when card is clicked
 * 
 * Displays a station card with status indicators and availability
 */

import { MapPin, Zap, DollarSign, Star, Navigation } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Station } from '../../data/sample';
import "../../styles/globals.css"
interface StationCardProps {
  station: Station;
  onClick?: () => void;
}

export function StationCard({ station, onClick }: StationCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPortStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'occupied':
        return 'text-orange-600 bg-orange-50';
      case 'offline':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card
      className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Station Name & Status */}
          <div className="flex items-start gap-2 mb-2">
            <h3 className="flex-1">{station.name}</h3>
            <div className={`h-2 w-2 rounded-full ${getStatusColor(station.status)}`} />
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{station.address}</span>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 mb-3">
            {/* Distance */}
            {station.distance !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                <Navigation className="h-4 w-4 text-[#0f766e]" />
                <span>{station.distance} km</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="h-4 w-4 text-[#0f766e]" />
              <span>{formatCurrency(station.pricePerKwh)}/kWh</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{station.rating}</span>
            </div>
          </div>

          {/* Ports */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm">
                {station.availablePorts}/{station.totalPorts} ports available
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {station.ports.map((port:any) => (
                <Badge
                  key={port.id}
                  variant="outline"
                  className={getPortStatusColor(port.status)}
                >
                  {port.type} {port.power}kW
                </Badge>
              ))}
            </div>
          </div>

          {/* Amenities */}
          {station.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {station.amenities.slice(0, 3).map((amenity:any) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {station.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{station.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          size="sm"
          className="bg-[#0f766e] hover:bg-[#0f766e]/90"
          onClick={(e:any) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          View
        </Button>
      </div>
    </Card>
  );
}
