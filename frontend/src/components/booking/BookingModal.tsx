import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { apiCreateBooking } from '../../api/BookingAPI';
import { CreateBookingRequest } from '../../types';
import axios from 'axios';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    pointId: number;
    stationName: string;
}

export function BookingModal({ isOpen, onClose, onSuccess, pointId, stationName }: BookingModalProps) {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleBooking = async () => {
        if (!startTime || !endTime) {
            toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc.");
            return;
        }

        setIsLoading(true);

        const request: CreateBookingRequest = {
            chargingPointId: pointId,
            startTime: startTime,
            endTime: endTime
        };

        try {
            await apiCreateBooking(request);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Booking failed:", error);
            let errorMessage = "Đặt chỗ thất bại.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || error.response.data || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đặt chỗ tại {stationName}</DialogTitle>
                    <DialogDescription>
                        Cổng sạc ID: {pointId}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                        <Input
                            id="startTime"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="endTime">Thời gian kết thúc</Label>
                        <Input
                            id="endTime"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full bg-[#0f766e] hover:bg-[#0f766e]/90"
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