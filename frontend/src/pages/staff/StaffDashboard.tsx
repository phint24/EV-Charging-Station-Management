import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import { Zap, MapPin, Users, DollarSign, Search, Check, CalendarClock, StopCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import "../../styles/globals.css";
import { apiGetBookingsForStation, apiUpdateBookingStatus } from '../../services/CSStaffAPI';
import { BookingDto, BookingStatus } from '../../types';
import { apiGetAllSessions, apiStopSession, apiStartSession, apiGetActiveSessions , apiResumeSession} from '../../services/sessionAPI';
import { ChargeSessionDto } from '../../types';

interface StaffDashboardProps {
    onNavigate: (path: string) => void;
}

export function StaffDashboard({ onNavigate }: StaffDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSessions, setActiveSessions] = useState<ChargeSessionDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState<BookingDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const data = await apiGetBookingsForStation();
            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            toast.error("Không thể tải danh sách đặt chỗ.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);
      const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await apiGetActiveSessions();
      setActiveSessions(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách phiên sạc");
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
    fetchSessions();
  }, []);

    const handleUpdateStatus = async (bookingId: number, newStatus: BookingStatus) => {
        try {
            await apiUpdateBookingStatus(bookingId, newStatus);
            toast.success(`Booking ${bookingId} đã được ${newStatus.toLowerCase()}!`);
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data || "Cập nhật thất bại.");
        }
    };

    const stats = [
        { icon: <Zap className="h-5 w-5" />, label: 'Active Sessions', value: '0', color: 'text-[#0f766e]', bgColor: 'bg-[#0f766e]/10', },
        { icon: <MapPin className="h-5 w-5" />, label: 'Stations Online', value: '1/1', color: 'text-green-600', bgColor: 'bg-green-100', },
        { icon: <CalendarClock className="h-5 w-5" />, label: 'Pending Bookings', value: bookings.filter(b => b.status === 'PENDING').length, color: 'text-blue-600', bgColor: 'bg-blue-100', },
        { icon: <DollarSign className="h-5 w-5" />, label: 'Revenue Today', value: '0₫', color: 'text-purple-600', bgColor: 'bg-purple-100', },
    ];
      const handleTogglePort = (portId: string, enabled: boolean) => {
        toast.success(`Port ${portId} ${enabled ? 'enabled' : 'disabled'}`);
        // API: POST /ports/{portId}/toggle
    };
      const handleToggleSession = async (session: ChargeSessionDto) => {
  try {
    if (session.status === "ACTIVE" || session.status === "CHARGING") {
      await apiStopSession(session.sessionId, { energyUsed: session.energyUsed || 0 });
      toast.success("Session stopped");
    } else {
      await apiStartSession({
        driverId: session.driverId,
        vehicleId: session.vehicleId,
        chargingPointId: session.chargingPointId,
      });
      toast.success("Session started");
    }
    // if (session.status === "CHARGING") {
    //   await apiStopSession(session.sessionId, { energyUsed: session.energyUsed || 0 });
    //   toast.success("Session stopped");
    // } else {
    //   await apiStartSession({
    //     driverId: session.driverId,
    //     vehicleId: session.vehicleId,
    //     chargingPointId: session.chargingPointId,
    //   });
    //   toast.success("Session started");
    // }
    await fetchSessions(); // cập nhật danh sách sau toggle
  } catch (err) {
    console.error(err);
    toast.error("Failed to toggle session");
  }
};
      const handleReportIncident = (stationId: string) => {
    toast.info('Incident report form opened');
    // Open incident report modal
  };
    const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1>Staff Dashboard</h1>
                <p className="text-gray-600">Monitor and manage station bookings</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                            </div>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
                  {/* Active Sessions */}
                <Card className="p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                    <h2>Active Charging Sessions</h2>
                    <Badge>{activeSessions.length} active</Badge>
                    </div>

                    <div className="rounded-2xl border overflow-hidden">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Station</TableHead>
                            <TableHead>Port</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>SOC</TableHead>
                            <TableHead>Energy</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {activeSessions.map((s) => (
                            <TableRow key={s.sessionId}>
                            <TableCell>{s.driverId}</TableCell>
                            <TableCell>{s.stationId}</TableCell>
                            <TableCell>{s.chargingPointId}</TableCell>
                            <TableCell>{new Date(s.startTime).toLocaleTimeString()}</TableCell>
                            <TableCell>
                                {s.status === "ACTIVE" ? (
                                <Badge className="bg-green-600">Charging</Badge>
                                ) : (
                                <Badge className="bg-gray-600">Complete</Badge>
                                )}
                                {/* {s.status === "CHARGING" ? (
                                <Badge className="bg-green-600">Charging</Badge>
                                ) : (
                                <Badge className="bg-gray-600">Stopped</Badge>
                                )} */}
                            </TableCell>
                            <TableCell>{s.energyUsed} kWh</TableCell>
                            <TableCell>{formatCurrency(s.cost)}</TableCell>
                            <TableCell>
                                {s.status === "ACTIVE" || s.status === "CHARGING" ? (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleToggleSession(s)}
                                >
                                    Stop
                                </Button>
                                ) : null}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </div>
                </Card>
            <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2>Bookings Management (Tại trạm của bạn)</h2>
                    <Badge>{bookings.length} bookings</Badge>
                </div>

                <div className="rounded-2xl border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Booking ID</TableHead>
                                <TableHead>Driver ID</TableHead>
                                <TableHead>Cổng sạc</TableHead>
                                <TableHead>Bắt đầu</TableHead>
                                <TableHead>Kết thúc</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">Đang tải...</TableCell>
                                </TableRow>
                            ) : bookings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">Không có lịch đặt chỗ nào.</TableCell>
                                </TableRow>
                            ) : (
                                bookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell>{booking.id}</TableCell>
                                        <TableCell>{booking.driverId}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">ID: {booking.chargingPointId}</Badge>
                                        </TableCell>
                                        <TableCell>{formatDateTime(booking.startTime)}</TableCell>
                                        <TableCell>{formatDateTime(booking.endTime)}</TableCell>
                                        <TableCell>
                                            <Badge className={
                                                booking.status === 'COMPLETED' ? 'bg-green-500' :
                                                    booking.status === 'CONFIRMED' ? 'bg-blue-500' :
                                                        booking.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                                            }>
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {/* (6) NÚT HÀNH ĐỘNG */}
                                            {booking.status === 'PENDING' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Confirm
                                                </Button>
                                            )}
                                            {booking.status === 'CONFIRMED' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Complete
                                                </Button>
                                            )}
                                            {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                                                <span className="text-xs text-gray-500">Đã xử lý</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

        </div>
    );
}