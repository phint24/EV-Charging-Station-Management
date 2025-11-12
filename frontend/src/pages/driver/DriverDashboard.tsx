import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { StationsMap } from '../../components/station/StationsMap';
import { StationCard } from '../../components/station/StationCard';
import { ChargingSessionPanel } from '../../components/charging/ChargingSessionPanel';
import { WalletPanel } from '../../components/payment/WalletPanel';
import { QRScannerButton } from '../../components/shared/QRScannerButton';
import { Zap, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import "../../styles/globals.css";
import axios from 'axios';

import { apiGetDriverProfile } from '../../services/DriverAPI';
import {
    apiGetAllSessions,
    apiStopSession
} from '../../services/ChargeSessionAPI';
import { apiGetAllStations } from '../../services/StationAPI';

import {
    ChargeSessionDto,
    EVDriverProfileDto,
    StopSessionData,
    ChargingStationDto
} from '../../types';

interface DriverDashboardProps {
    onNavigate: (path: string) => void;
    isWalletDialogOpen?: boolean;
    onWalletDialogChange?: (open: boolean) => void;
}

export function DriverDashboard({ onNavigate, isWalletDialogOpen, onWalletDialogChange }: DriverDashboardProps) {

    const [activeSession, setActiveSession] = useState<ChargeSessionDto | null>(null);
    const [driverProfile, setDriverProfile] = useState<EVDriverProfileDto | null>(null);
    const [stations, setStations] = useState<ChargingStationDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        const loadDashboardData = async () => {
            console.log("Đang tải dữ liệu dashboard...");
            try {
                setIsLoading(true);

                const [profile, allSessions, allStations] = await Promise.all([
                    apiGetDriverProfile(),
                    apiGetAllSessions(),
                    apiGetAllStations()
                ]);

                setDriverProfile(profile);
                setWalletBalance(profile.walletBalance);
                console.log("Tải hồ sơ thành công:", profile);

                const runningSession = allSessions.find(session => session.status === 'ACTIVE');
                setActiveSession(runningSession || null);
                console.log("Tải phiên sạc thành công:", runningSession);

                setStations(allStations);
                console.log("Tải trạm sạc thành công:", allStations);

            } catch (error) {
                console.error('Không thể tải dữ liệu dashboard:', error);
                toast.error('Lỗi khi tải dữ liệu. Vui lòng thử đăng nhập lại.');
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const handleStationClick = (stationId: number) => {
        onNavigate(`/driver/station/${stationId}`);
    };

    const handleTopUp = (amount: number, method: string) => {
        setWalletBalance((prev) => prev + amount);
        toast.success(`Added ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)} to wallet`);
    };

    const handleQRScan = (stationId: string) => {
        toast.success('Station found via QR code');
        onNavigate(`/driver/station/${stationId}`);
    };

    const stats = [
        { icon: <Zap className="h-5 w-5" />, label: 'Total Sessions', value: '47', change: '+12% this month', color: 'text-[#0f766e]', },
        { icon: <TrendingUp className="h-5 w-5" />, label: 'Energy Consumed', value: '1,245 kWh', change: '+8% this month', color: 'text-blue-600', },
        { icon: <DollarSign className="h-5 w-5" />, label: 'Total Spent', value: '5,602,500 ₫', change: '-5% this month', color: 'text-green-600', },
        { icon: <Clock className="h-5 w-5" />, label: 'Avg. Session', value: '38 min', change: '-3 min', color: 'text-orange-600', },
    ];

    const handleStopCharging = async () => {
        if (!activeSession) return;

        const startTime = new Date(activeSession.startTime).getTime();
        const endTime = new Date().getTime();

        const hoursElapsed = (endTime - startTime) / 3600000.0;

        const MOCK_POWER_KW = 50.0;

        const calculatedEnergyUsed = MOCK_POWER_KW * hoursElapsed*100;
        const roundedEnergyUsed = Math.round(calculatedEnergyUsed * 100) / 100;

        const stopData: StopSessionData = {
            energyUsed: roundedEnergyUsed
        };

        try {
            const stoppedSession = await apiStopSession(activeSession.sessionId, stopData);

            setActiveSession(null);
            toast.success('Đã dừng phiên sạc.');

            setWalletBalance(prev => prev - stoppedSession.cost);

        } catch (error: any) {
            console.error('Failed to stop session:', error);
            let errorMessage = "Không thể dừng phiên sạc.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            }
            toast.error(errorMessage);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <p>Đang tải dữ liệu dashboard...</p>
            </div>
        );
    }

    if (!driverProfile) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-red-600">Không thể tải dữ liệu</h2>
                <p className="text-gray-600 mb-4">Vui lòng thử đăng nhập lại.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1>Welcome back, {driverProfile.userAccount.name}!</h1>
                    <p className="text-gray-600">Track your charging activity and find nearby stations</p>
                </div>
                <QRScannerButton onScan={handleQRScan} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-4 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-2xl mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-xs text-gray-500">{stat.change}</p>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {activeSession ? (
                        <ChargingSessionPanel
                            session={activeSession}
                            onStop={handleStopCharging}
                        />
                    ) : (
                        <Card className="p-6 rounded-2xl bg-blue-50 border-blue-200">
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-lg font-medium">Bạn không có phiên sạc nào đang hoạt động.</p>
                                <p className="text-sm text-gray-600">
                                    Vui lòng chọn một trạm sạc từ bản đồ hoặc danh sách bên dưới để bắt đầu.
                                </p>
                            </div>
                        </Card>
                    )}

                    <Card className="p-4 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2>Nearby Stations</h2>
                            <Badge variant="outline">{stations.length} stations</Badge>
                        </div>
                        <div className="h-[400px]">
                            <StationsMap stations={stations} onStationClick={handleStationClick} />
                        </div>
                    </Card>

                    <div>
                        <h2 className="mb-4">Available Stations</h2>
                        <div className="space-y-4">
                            {stations.map((station) => (
                                <StationCard
                                    key={station.stationId}
                                    station={station}
                                    onClick={() => handleStationClick(station.stationId)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <WalletPanel
                        balance={walletBalance}
                        onTopUp={handleTopUp}
                        isOpen={isWalletDialogOpen}
                        onOpenChange={onWalletDialogChange}
                    />
                </div>
            </div>
        </div>
    );
}