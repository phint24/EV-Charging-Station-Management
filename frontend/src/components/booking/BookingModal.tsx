
import { useState } from 'react';
import { Calendar, Clock, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Station } from '../../data/sample';
import "../../styles/globals.css"

interface BookingModalProps {
  station: Station;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (portId: string, startTime: Date) => void;
}

export function BookingModal({ station, isOpen, onClose, onConfirm }: BookingModalProps) {
  const [selectedPortId, setSelectedPortId] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('now');
  const [scheduledTime, setScheduledTime] = useState<string>('');

  const availablePorts = station.ports.filter((port: any) => port.status === 'available');

  const handleConfirm = () => {
    if (!selectedPortId) {
      alert('Please select a port');
      return;
    }

    let startTime = new Date();
    if (selectedTime === 'scheduled' && scheduledTime) {
      startTime = new Date(scheduledTime);
    }

    onConfirm(selectedPortId, startTime);
    onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Charging Session</DialogTitle>
          <DialogDescription>{station.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Select Port */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4" />
              Select Charging Port
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {station.ports.map((port:any) => {
                const isAvailable = port.status === 'available';
                const isSelected = selectedPortId === port.id;

                return (
                  <button
                    key={port.id}
                    disabled={!isAvailable}
                    onClick={() => setSelectedPortId(port.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#0f766e] bg-[#0f766e]/5'
                        : isAvailable
                        ? 'border-gray-200 hover:border-[#0f766e]/50'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span>{port.type}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPortStatusColor(port.status)}`}
                      >
                        {port.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{port.power} kW</p>
                  </button>
                );
              })}
            </div>
            {availablePorts.length === 0 && (
              <p className="text-sm text-red-600 mt-2">No ports available at this station</p>
            )}
          </div>

          {/* Select Time */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" />
              When do you want to charge?
            </Label>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedTime('now')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedTime === 'now'
                    ? 'border-[#0f766e] bg-[#0f766e]/5'
                    : 'border-gray-200 hover:border-[#0f766e]/50'
                }`}
              >
                <p>Start Now</p>
                <p className="text-sm text-gray-600">Begin charging immediately</p>
              </button>

              <button
                onClick={() => setSelectedTime('scheduled')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedTime === 'scheduled'
                    ? 'border-[#0f766e] bg-[#0f766e]/5'
                    : 'border-gray-200 hover:border-[#0f766e]/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <p>Schedule for Later</p>
                </div>
                {selectedTime === 'scheduled' && (
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border rounded-lg"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Estimated Cost */}
          {selectedPortId && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">Estimated Cost</p>
              <p className="text-sm">
                Starting rate: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(station.pricePerKwh)}/kWh
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Final cost depends on actual energy consumed
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPortId}
            className="bg-[#0f766e] hover:bg-[#0f766e]/90"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
//  export default BookingModal