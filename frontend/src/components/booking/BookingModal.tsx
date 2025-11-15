import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { apiCreateBooking } from '../../services/BookingAPI';
import { CreateBookingRequest } from '../../types';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    pointId: number;
    stationName: string;
}

export function BookingModal({ isOpen, onClose, pointId, stationName }: BookingModalProps) {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleBooking = async () => {
        if (!startTime || !endTime) {
            toast.error("Vui lòng chọn thời gian");
            return;
        }

        setIsLoading(true);
        const request: CreateBookingRequest = {
            chargingPointId: pointId,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString()
        };

        try {
            await apiCreateBooking(request);
            toast.success("Đặt chỗ thành công!");
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data || "Đặt chỗ thất bại. Khung giờ có thể đã bị trùng.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đặt chỗ tại {stationName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">Cổng sạc ID: {pointId}</p>
                    <div>
                        <Label>Thời gian bắt đầu</Label>
                        <Input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Thời gian kết thúc</Label>
                        <Input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full bg-[#0f766e]"
                        onClick={handleBooking}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Xác nhận Đặt chỗ"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}