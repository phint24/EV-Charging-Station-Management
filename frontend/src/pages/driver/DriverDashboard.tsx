import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { StationsMap } from '../../components/station/StationsMap';
import { StationCard } from '../../components/station/StationCard';
import { ChargingSessionPanel } from '../../components/charging/ChargingSessionPanel';
import { WalletPanel } from '../../components/payment/WalletPanel';
import { QRScannerButton } from '../../components/shared/QRScannerButton';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';
import "../../styles/globals.css";
import axios from 'axios';

import { apiGetDriverProfile } from '../../services/DriverAPI';
import {
    apiGetAllSessions,
    apiStartSession,
    apiStopSession
} from '../../services/ChargeSessionAPI';
import { apiGetAllStations } from '../../services/StationAPI';

import {
    ChargeSessionDto,
    EVDriverProfileDto,
    CreateSessionData,
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

    const handleBalanceUpdate = (newBalance: number) => {
        setWalletBalance(newBalance);
        if (driverProfile) {
            setDriverProfile({ ...driverProfile, walletBalance: newBalance });
        }
    };

    const handleQRScan = (stationId: string) => {
        toast.success('Station found via QR code');
        onNavigate(`/driver/station/${stationId}`);
    };

    const handleStartCharging = async () => {

        if (!driverProfile) {
            toast.error("Không tìm thấy thông tin tài xế.");
            return;
        }
        if (!driverProfile.vehicles || driverProfile.vehicles.length === 0) {
            toast.error("Bạn chưa thêm xe nào vào hồ sơ.");
            return;
        }

        const vehicleId = driverProfile.vehicles[0].id;
        const chargingPointId = 1;

        const sessionData: CreateSessionData = {
            driverId: driverProfile.id,
            vehicleId: vehicleId,
            chargingPointId: chargingPointId
        };

        try {
            const newSession = await apiStartSession(sessionData);
            setActiveSession(newSession);
            toast.success('Bắt đầu phiên sạc thành công!');
        } catch (error: any) {
            console.error('Failed to start session:', error);
            let errorMessage = "Không thể bắt đầu phiên sạc.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            }
            toast.error(errorMessage);
        }
    };

    const handleStopCharging = async () => {
        if (!activeSession) return;

        const stopData: StopSessionData = {
            energyUsed: 10.5
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

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {activeSession ? (
                        <ChargingSessionPanel
                            session={activeSession}
                            onStop={handleStopCharging}
                        />
                    ) : (
                        <Card className="p-6 rounded-2xl">
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-lg">Bạn không có phiên sạc nào đang hoạt động.</p>
                                <Button
                                    onClick={handleStartCharging}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Zap className="mr-2 h-4 w-4" /> Bắt đầu Sạc (Test)
                                </Button>
                                <p className="text-sm text-gray-500">
                                    (Giả lập sạc tại Cổng 1, Xe đầu tiên)
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
                        onBalanceUpdate={handleBalanceUpdate}
                        isOpen={isWalletDialogOpen}
                        onOpenChange={onWalletDialogChange}
                    />
                </div>
            </div>
        </div>
    );
}