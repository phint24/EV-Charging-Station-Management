import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { StationsMap } from '../../components/station/StationsMap';
import { StationCard } from '../../components/station/StationCard';
import { ChargingSessionPanel } from '../../components/charging/ChargingSessionPanel';
import { WalletPanel } from '../../components/payment/WalletPanel';
import { QRScannerButton } from '../../components/shared/QRScannerButton';
import { Zap, Car, Plus, Trash2, CreditCard, Building2, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import "../../styles/globals.css";
import axios from 'axios';

import {
    apiGetDriverProfile,
    apiAddVehicle,
    apiDeleteVehicle,
    apiGetPaymentMethods,
    apiDeletePaymentMethod
} from '../../services/DriverAPI';
import {
    apiGetAllSessions,
    apiStartSession,
    apiStopSession
} from '../../services/ChargeSessionAPI';
import { apiGetAllStations } from '../../services/StationAPI';
import {
    apiGetMyBookings,
    apiCancelBooking
} from '../../services/BookingAPI';
import { AddVehicleModal } from '../../components/vehicle/AddVehicleModal';
import { AddPaymentMethodModal } from '../../components/payment/AddPaymentMethodModal';

import {
    ChargeSessionDto,
    EVDriverProfileDto,
    CreateSessionData,
    StopSessionData,
    ChargingStationDto,
    VehicleDto,
    PaymentMethodDto,
    BookingDto
} from '../../types';

import { ChatbotPanel } from '../../components/chatbot/ChatbotPanel';
import { apiSendChatMessage, apiClearChatHistory } from '../../services/ChatbotAPI';

interface DriverDashboardProps {
    onNavigate: (path: string) => void;
    isWalletDialogOpen?: boolean;
    onWalletDialogChange?: (open: boolean) => void;
}

function VehicleCard({ vehicle, onDelete }: { vehicle: VehicleDto, onDelete: () => void }) {
    return (
        <div className="p-4 rounded-lg border bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Car className="h-6 w-6 text-[#0f766e]" />
                <div>
                    <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-sm text-gray-500">{vehicle.vehicleId} - {vehicle.connectorType}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

function PaymentMethodCard({ method, onDelete }: { method: PaymentMethodDto, onDelete: () => void }) {
    return (
        <div className="p-4 rounded-lg border bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
                {method.type === 'CREDIT_CARD' ? <CreditCard className="h-6 w-6 text-blue-500" /> : <Building2 className="h-6 w-6 text-green-500" />}
                <div>
                    <p className="font-medium">{method.provider}</p>
                    <p className="text-sm text-gray-500">
                        {method.type.replace('_', ' ')}
                        {method.isDefault && <span className="text-xs text-green-600 ml-2">(Mặc định)</span>}
                    </p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

function BookingCard({ booking, onCancel }: { booking: BookingDto, onCancel: () => void }) {
    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-4 rounded-lg border bg-white">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium">{booking.stationName}</p>
                    <p className="text-sm text-gray-500">Cổng ID: {booking.chargingPointId}</p>
                </div>
                <Badge variant={booking.status === 'PENDING' ? "default" : "secondary"}>
                    {booking.status}
                </Badge>
            </div>
            <div className="text-sm text-gray-700 mt-2">
                <p>Từ: {formatDateTime(booking.startTime)}</p>
                <p>Đến: {formatDateTime(booking.endTime)}</p>
            </div>
            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                <Button variant="link" size="sm" onClick={onCancel} className="text-red-500 p-0 h-auto mt-2">
                    Hủy đặt chỗ
                </Button>
            )}
        </div>
    );
}


export function DriverDashboard({ onNavigate, isWalletDialogOpen, onWalletDialogChange }: DriverDashboardProps) {

    const [activeSession, setActiveSession] = useState<ChargeSessionDto | null>(null);
    const [driverProfile, setDriverProfile] = useState<EVDriverProfileDto | null>(null);
    const [stations, setStations] = useState<ChargingStationDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(0);
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
    const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);
    const [bookings, setBookings] = useState<BookingDto[]>([]);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const loadDashboardData = async () => {
        console.log("Đang tải dữ liệu dashboard...");
        try {
            setIsLoading(true);

            const [profile, allSessions, allStations, methods, myBookings] = await Promise.all([
                apiGetDriverProfile(),
                apiGetAllSessions(),
                apiGetAllStations(),
                apiGetPaymentMethods(),
                apiGetMyBookings()
            ]);

            setDriverProfile(profile);
            setWalletBalance(profile.walletBalance);
            console.log("Tải hồ sơ thành công:", profile);

            const runningSession = allSessions.find(session => session.status === 'ACTIVE');
            setActiveSession(runningSession || null);
            console.log("Tải phiên sạc thành công:", runningSession);

            setStations(allStations);
            console.log("Tải trạm sạc thành công:", allStations);

            setPaymentMethods(methods);
            console.log("Tải phương thức thanh toán thành công:", methods);

            setBookings(myBookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED'));
            console.log("Tải đặt chỗ thành công:", myBookings);

        } catch (error) {
            console.error('Không thể tải dữ liệu dashboard:', error);
            toast.error('Lỗi khi tải dữ liệu. Vui lòng thử đăng nhập lại.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const handleSendChatMessage = async (message: string): Promise<string> => {
    try {
        const response = await apiSendChatMessage(message);
        return response.response;
      } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
      }
    };

    const handleClearChatHistory = async () => {
    try {
        await apiClearChatHistory();
        toast.success('Đã xóa lịch sử chat');
      } catch (error) {
        console.error('Error clearing chat history:', error);
        toast.error('Không thể xóa lịch sử chat');
      }
   };

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

    const handleStopCharging = async (finalEnergy: number) => {
        if (!activeSession) return;
        const roundedEnergyUsed = Math.round(finalEnergy * 100) / 100;
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

    const handleVehicleChange = async () => {
        try {
            const profile = await apiGetDriverProfile();
            setDriverProfile(profile);
        } catch (error) {
            toast.error("Không thể cập nhật danh sách xe.");
        }
    };

    const handleDeleteVehicle = async (vehicleId: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa xe này?")) {
            try {
                await apiDeleteVehicle(vehicleId);
                toast.success("Đã xóa xe thành công.");
                handleVehicleChange();
            } catch (error) {
                toast.error("Không thể xóa xe.");
            }
        }
    };

    const handlePaymentMethodChange = async () => {
        try {
            const methods = await apiGetPaymentMethods();
            setPaymentMethods(methods);
        } catch (error) {
            toast.error("Không thể cập nhật danh sách thanh toán.");
        }
    };

    const handleDeletePaymentMethod = async (methodId: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phương thức thanh toán này?")) {
            try {
                await apiDeletePaymentMethod(methodId);
                toast.success("Đã xóa phương thức thanh toán.");
                handlePaymentMethodChange();
            } catch (error) {
                toast.error("Không thể xóa.");
            }
        }
    };

    const handleCancelBooking = async (bookingId: number) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy lịch đặt chỗ này?")) {
            try {
                await apiCancelBooking(bookingId);
                toast.success("Đã hủy đặt chỗ thành công.");

                const myBookings = await apiGetMyBookings();
                setBookings(myBookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED'));
            } catch (error) {
                toast.error("Không thể hủy đặt chỗ.");
            }
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

                    <Card className="p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Lịch đặt chỗ sắp tới</h3>
                        </div>
                        <div className="space-y-3">
                            {bookings.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Bạn không có lịch đặt chỗ nào.
                                </p>
                            ) : (
                                bookings.map(booking => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onCancel={() => handleCancelBooking(booking.id)}
                                    />
                                ))
                            )}
                        </div>
                    </Card>

                    <Card className="p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Phương tiện của tôi</h3>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsAddVehicleModalOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Thêm Xe
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {driverProfile.vehicles.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Bạn chưa thêm phương tiện nào.
                                </p>
                            ) : (
                                driverProfile.vehicles.map(vehicle => (
                                    <VehicleCard
                                        key={vehicle.id}
                                        vehicle={vehicle}
                                        onDelete={() => handleDeleteVehicle(vehicle.id)}
                                    />
                                ))
                            )}
                        </div>
                    </Card>

                    <Card className="p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Thanh toán</h3>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsAddMethodModalOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Thêm Thẻ
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {paymentMethods.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Bạn chưa thêm phương thức thanh toán nào.
                                </p>
                            ) : (
                                paymentMethods.map(method => (
                                    <PaymentMethodCard
                                        key={method.id}
                                        method={method}
                                        onDelete={() => handleDeletePaymentMethod(method.id)}
                                    />
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <AddVehicleModal
                isOpen={isAddVehicleModalOpen}
                onClose={() => setIsAddVehicleModalOpen(false)}
                onSuccess={handleVehicleChange}
            />

            <AddPaymentMethodModal
                isOpen={isAddMethodModalOpen}
                onClose={() => setIsAddMethodModalOpen(false)}
                onSuccess={handlePaymentMethodChange}
                driverId={driverProfile.id}
            />

            <ChatbotPanel
                onSendMessage={handleSendChatMessage}
                onClearHistory={handleClearChatHistory}
                isOpen={isChatbotOpen}
                onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
            />
        </div>
    );
}