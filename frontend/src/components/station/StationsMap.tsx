/**
 * StationsMap Component
 * Props:
 * - stations: Array of Station objects
 * - onStationClick: (stationId: string) => void
 * 
 * Displays an interactive map with station markers
 * NOTE: This is a placeholder map visualization. In production, integrate with Google Maps, Mapbox, or similar
 */

import { MapPin, Navigation } from 'lucide-react';
import { Station } from '../../data/sample';
import { Badge } from '../ui/badge';
import "../../styles/globals.css"
interface StationsMapProps {
  stations: Station[];
  onStationClick: (stationId: string) => void;
}

export function StationsMap({ stations, onStationClick }: StationsMapProps) {
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

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-2xl overflow-hidden">
      {/* Placeholder Map Background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          {/* Grid Pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />
          
          {/* Roads */}
          <path
            d="M 0 300 Q 200 280 400 300 T 800 300"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 400 0 Q 380 200 400 400 T 400 600"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Parks (green areas) */}
          <circle cx="150" cy="150" r="60" fill="#86efac" opacity="0.3" />
          <circle cx="650" cy="450" r="80" fill="#86efac" opacity="0.3" />
        </svg>
      </div>

      {/* Station Markers */}
      <div className="absolute inset-0">
        {stations.map((station, index) => {
          // Simple positioning based on index (in production, use actual lat/lng)
          const positions = [
            { x: '20%', y: '30%' },
            { x: '45%', y: '50%' },
            { x: '65%', y: '25%' },
            { x: '75%', y: '60%' },
          ];
          const pos = positions[index % positions.length];

          return (
            <div
              key={station.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: pos.x, top: pos.y }}
              onClick={() => onStationClick(station.id)}
            >
              {/* Marker Pin */}
              <div className="relative">
                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-3 ${getStatusColor(station.status)} shadow-lg animate-pulse`}>
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-1 h-2 bg-gray-800" />
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-64">
                  <div className="bg-white rounded-xl shadow-xl p-3 border">
                    <p className="mb-1">{station.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Navigation className="h-3 w-3" />
                      <span>{station.distance} km away</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {station.availablePorts}/{station.totalPorts} available
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(station.status)} text-white`}>
                        {station.status}
                      </Badge>
                    </div>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                    <div className="border-8 border-transparent border-t-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white rounded-lg shadow p-2 hover:bg-gray-50">
          <span className="text-xl">+</span>
        </button>
        <button className="bg-white rounded-lg shadow p-2 hover:bg-gray-50">
          <span className="text-xl">−</span>
        </button>
        <button className="bg-white rounded-lg shadow p-2 hover:bg-gray-50">
          <Navigation className="h-5 w-5" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-3">
        <p className="text-sm mb-2">Status</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Online</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span>Offline</span>
          </div>
        </div>
      </div>

      {/* API Integration Note */}
      <div className="absolute top-4 left-4 bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm text-blue-800">
        📍 Map Placeholder - Integrate Google Maps/Mapbox API
      </div>
    </div>
  );
}
