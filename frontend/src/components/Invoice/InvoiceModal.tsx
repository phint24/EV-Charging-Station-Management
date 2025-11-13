import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ChargeSessionDto } from '../../types';
import { Zap, Clock, DollarSign, Calendar, MapPin } from 'lucide-react';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: ChargeSessionDto;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDuration = (start: string, end: string) => {
    const durationMs = new Date(end).getTime() - new Date(start).getTime();
    if (durationMs < 0) return "0m 0s";
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
};

export function InvoiceModal({ isOpen, onClose, session }: InvoiceModalProps) {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">Phiên sạc Hoàn tất</DialogTitle>
                    <DialogDescription className="text-center">
                        Chi tiết hóa đơn cho giao dịch của bạn.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-4">
                    {/* Chi phí (Đã trừ vào ví) */}
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Tổng chi phí (Đã trừ vào ví)</p>
                        <p className="text-4xl font-bold text-[#0f766e]">
                            {formatCurrency(session.cost)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-gray-500">Năng lượng đã dùng</p>
                            <p className="font-medium flex items-center gap-1">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                {session.energyUsed.toFixed(2)} kWh
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-500">Thời gian sạc</p>
                            <p className="font-medium flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDuration(session.startTime, session.endTime!)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-500">Trạm sạc</p>
                            <p className="font-medium flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Trạm ID: {session.stationId}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-500">Ngày</p>
                            <p className="font-medium flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(session.endTime!).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={onClose}
                    className="w-full bg-[#0f766e] hover:bg-[#0f766e]/90"
                    size="lg"
                >
                    Xác nhận
                </Button>
            </DialogContent>
        </Dialog>
    );
}