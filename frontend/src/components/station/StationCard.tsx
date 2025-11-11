import { MapPin, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ChargingStationDto } from '../../types';
import "../../styles/globals.css"

interface StationCardProps {
    station: ChargingStationDto;
    onClick?: () => void;
}

const getStatusColorClass = (status: 'AVAILABLE' | 'IN_USE' | 'OFFLINE' | 'FAULTED') => {
    switch (status) {
        case 'AVAILABLE':
            return 'bg-green-500';
        case 'IN_USE':
            return 'bg-yellow-500';
        case 'OFFLINE':
            return 'bg-gray-500';
        case 'FAULTED':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

export function StationCard({ station, onClick }: StationCardProps) {

    const available = station.availableChargers;
    const total = station.totalChargingPoint;
    const isAvailable = available > 0 && station.status === 'AVAILABLE';

    return (
        <Card
            className="p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    {/* Tên Trạm & Trạng thái */}
                    <div className="flex items-start gap-2 mb-2">
                        <h3 className="flex-1 font-semibold">{station.name}</h3>
                        <Badge
                            className={`text-white ${getStatusColorClass(station.status)}`}
                        >
                            {station.status}
                        </Badge>
                    </div>

                    {/* Địa chỉ (Sửa 'address' thành 'location') */}
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{station.location}</span>
                    </div>


                    {/* Cổng sạc (Dùng DTO) */}
                    <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4" />
                            <span className="text-sm">
                {station.availableChargers}/{station.totalChargingPoint} ports available
              </span>
                        </div>

                        {/* (Vì DTO không chứa danh sách cổng sạc để tránh lỗi lồng nhau) */}
                    </div>

                </div>

                {/* Nút View (Giữ nguyên) */}
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