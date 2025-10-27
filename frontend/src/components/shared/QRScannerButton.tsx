/**
 * QRScannerButton Component
 * Opens a modal to scan QR code for quick station access
 */

import { useState } from 'react';
import { QrCode, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import "../../styles/globals.css"
interface QRScannerButtonProps {
  onScan: (stationId: string) => void;
}

export function QRScannerButton({ onScan }: QRScannerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Mock QR scan - in production, integrate with device camera
  const handleMockScan = () => {
    setTimeout(() => {
      const mockStationId = 'st-001';
      onScan(mockStationId);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[#0f766e] hover:bg-[#0f766e]/90"
      >
        <QrCode className="mr-2 h-5 w-5" />
        Scan QR Code
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Scan Station QR Code</DialogTitle>
            <DialogDescription>
              Point your camera at the station QR code to quickly access charging
            </DialogDescription>
          </DialogHeader>

          <div className="py-8">
            {/* QR Scanner Placeholder */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {/* Camera viewfinder mockup */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-24 w-24 text-gray-400" />
              </div>

              {/* Scanning frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-[#0f766e] rounded-2xl relative">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />

                  {/* Scanning line animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#0f766e] animate-pulse" />
                </div>
              </div>

              {/* API Integration Note */}
              <div className="absolute bottom-4 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm text-blue-800 text-center">
                📱 Camera API Integration Required
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Align the QR code within the frame
            </p>

            {/* Mock Scan Button (for demo) */}
            <Button
              onClick={handleMockScan}
              className="w-full mt-4 bg-[#0f766e] hover:bg-[#0f766e]/90"
            >
              Simulate QR Scan (Demo)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
