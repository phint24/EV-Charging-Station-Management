import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowLeft, MapPin, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { apiGetStationById } from '../../api/StationAPI';
import { ChargingStationDto } from '../../types';
import { StationChargingPoints } from '../../components/station/StationChargingPoints';

interface StationDetailPageProps {
    stationId: number;
    onBack: () => void;
}

export function StationDetailPage({ stationId, onBack }: StationDetailPageProps) {
    const [station, setStation] = useState<ChargingStationDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStation();
    }, [stationId]);

    const loadStation = async () => {
        setIsLoading(true);
        try {
            const data = await apiGetStationById(stationId);
            setStation(data);
        } catch (error) {
            console.error('Error loading station:', error);
            toast.error('Không thể tải thông tin trạm sạc');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            AVAILABLE: { label: 'Sẵn sàng', className: 'bg-green-500' },
            IN_USE: { label: 'Đang bận', className: 'bg-blue-500' },
            OFFLINE: { label: 'Ngoại tuyến', className: 'bg-gray-500' },
            FAULTED: { label: 'Bị lỗi', className: 'bg-red-500' },
        };
        
        const info = statusMap[status] || { label: status, className: 'bg-gray-500' };
        return <Badge className={info.className}>{info.label}</Badge>;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Đang tải...</p>
            </div>
        );
    }

    if (!station) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 mb-4">Không tìm thấy trạm sạc</p>
                <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
            </div>

            {/* Station Info */}
            <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{station.name}</h1>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{station.location}</span>
                        </div>
                    </div>
                    {getStatusBadge(station.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-5 w-5 text-blue-600" />
                            <p className="text-sm text-gray-600">Tổng số cổng</p>
                        </div>
                        <p className="text-2xl font-bold">{station.totalChargingPoint}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-5 w-5 text-green-600" />
                            <p className="text-sm text-gray-600">Cổng khả dụng</p>
                        </div>
                        <p className="text-2xl font-bold">{station.availableChargers}</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-5 w-5 text-purple-600" />
                            <p className="text-sm text-gray-600">Đang sử dụng</p>
                        </div>
                        <p className="text-2xl font-bold">
                            {station.totalChargingPoint - station.availableChargers}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Charging Points List */}
            <StationChargingPoints 
                stationId={station.stationId} 
                stationName={station.name}
            />
        </div>
    );
}