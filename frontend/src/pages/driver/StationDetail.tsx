import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Zap, Clock, DollarSign, Navigation, Phone, Wifi, Coffee, Utensils } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import "../../styles/globals.css"
import axios from 'axios';

import {
    apiGetStationById,
    apiGetChargingPointsByStationId
} from '../../services/StationAPI';
import { apiGetDriverProfile } from '../../services/DriverAPI';
import { apiStartSession } from '../../services/ChargeSessionAPI';

import {
    ChargingStationDto,
    ChargingPointDto,
    EVDriverProfileDto,
    CreateSessionData
} from '../../types';

interface StationDetailProps {
    stationId: number;
    onNavigate: (path: string) => void;
}

export function StationDetail({ stationId, onNavigate }: StationDetailProps) {
    const [station, setStation] = useState<ChargingStationDto | null>(null);
    const [points, setPoints] = useState<ChargingPointDto[]>([]);
    const [profile, setProfile] = useState<EVDriverProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [isStartingSession, setIsStartingSession] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [stationData, profileData, pointsData] = await Promise.all([
                    apiGetStationById(stationId),
                    apiGetDriverProfile(),
                    apiGetChargingPointsByStationId(stationId)
                ]);

                setStation(stationData);
                setProfile(profileData);
                setPoints(pointsData);

                if (profileData.vehicles && profileData.vehicles.length > 0) {
                    setSelectedVehicleId(profileData.vehicles[0].id);
                }

            } catch (error) {
                toast.error("Không thể tải chi tiết trạm.");
                console.error("Failed to load station detail:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [stationId]);

    const handleStartCharging = async () => {
        if (!profile) {
            toast.error("Không tìm thấy thông tin tài xế.");
            return;
        }
        if (!selectedPointId) {
            toast.error("Vui lòng chọn một điểm sạc (cổng).");
            return;
        }
        if (!selectedVehicleId) {
            toast.error("Vui lòng chọn xe của bạn.");
            return;
        }

        setIsStartingSession(true);

        const sessionData: CreateSessionData = {
            driverId: profile.id,
            vehicleId: selectedVehicleId,
            chargingPointId: selectedPointId
        };

        try {
            const newSession = await apiStartSession(sessionData);
            toast.success(`Bắt đầu sạc tại cổng ${newSession.chargingPointId}!`);
            onNavigate('/driver/dashboard');
        } catch (error: any) {
            console.error('Failed to start session:', error);
            let errorMessage = "Không thể bắt đầu phiên sạc.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || error.response.data || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setIsStartingSession(false);
        }
    };

    const getPointStatusColor = (status: 'AVAILABLE' | 'CHARGING' | 'RESERVED' | 'OFFLINE' | 'FAULTED') => {
        switch (status) {
            case 'AVAILABLE':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'CHARGING':
            case 'RESERVED':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'OFFLINE':
            case 'FAULTED':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center">Đang tải chi tiết trạm...</div>;
    }

    if (!station || !profile) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-red-600">Không thể tải dữ liệu</h2>
                <p className="text-gray-600 mb-4">Vui lòng thử đăng nhập lại.</p>
                <Button variant="outline" onClick={() => onNavigate('/driver/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại Dashboard
                </Button>
            </div>
        );
    }

    const { name, location, status } = station;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Button
                variant="ghost"
                onClick={() => onNavigate('/driver/dashboard')}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 rounded-2xl">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{name}</h1>
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{location}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge
                                        className={
                                            status === 'AVAILABLE'
                                                ? 'bg-green-500'
                                                : (status === 'OFFLINE' || status === 'FAULTED')
                                                    ? 'bg-red-500'
                                                    : 'bg-yellow-500'
                                        }
                                    >
                                        {status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Bắt đầu Sạc</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium">1. Chọn xe của bạn</label>
                                <Select
                                    value={selectedVehicleId?.toString()}
                                    onValueChange={(val) => setSelectedVehicleId(Number(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn xe..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {profile.vehicles.length === 0 ? (
                                            <SelectItem value="none" disabled>Bạn chưa có xe</SelectItem>
                                        ) : (
                                            profile.vehicles.map(vehicle => (
                                                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                                    {vehicle.brand} {vehicle.model} ({vehicle.vehicleId})
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">2. Chọn điểm sạc (Cổng)</label>
                                <Select
                                    value={selectedPointId?.toString()}
                                    onValueChange={(val) => setSelectedPointId(Number(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn điểm sạc..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {points.length === 0 ? (
                                            <SelectItem value="none" disabled>Trạm này không có điểm sạc nào</SelectItem>
                                        ) : (
                                            points.map(point => (
                                                <SelectItem
                                                    key={point.chargingPointId}
                                                    value={point.chargingPointId.toString()}
                                                    disabled={point.status !== 'AVAILABLE'}
                                                >
                                                    Cổng {point.chargingPointId} ({point.type}) - {point.power}kW - {point.status}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            onClick={handleStartCharging}
                            disabled={isStartingSession || !selectedPointId || !selectedVehicleId}
                            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
                            size="lg"
                        >
                            {isStartingSession ? "Đang kết nối..." : "Bắt Đầu Sạc Ngay"}
                        </Button>
                    </Card>
                </div>

                <div className="space-y-6">

                    <Card className="p-6 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-5 w-5 text-[#0f766e]" />
                            <h3>Operating Hours</h3>
                        </div>
                        <p className="text-gray-600">24/7</p>
                    </Card>

                    <Card className="p-6 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Phone className="h-5 w-5 text-[#0f766e]" />
                            <h3>Contact</h3>
                        </div>
                        <p className="text-gray-600">Hotline: 1800-8888</p>
                    </Card>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => toast.info('Opening directions in maps... (Demo)')}
                    >
                        <Navigation className="mr-2 h-4 w-4" />
                        Get Directions
                    </Button>
                </div>
            </div>
        </div>
    );
}