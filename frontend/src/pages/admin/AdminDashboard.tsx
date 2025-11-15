import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import "../../styles/globals.css"
import { apiGetAllUsers } from '../../services/UserAPI';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MapPin, DollarSign, Zap, AlertCircle, Download, Plus, UserPlus } from 'lucide-react';
import { revenueByStation, utilizationByHour } from '../../data/sample';
import { toast } from 'sonner';
import { exportRevenueReport } from '../../services/ReportAPI';
import { AddStationModal } from '../../components/station/AddStationModal';
import { apiGetAllStations, apiUpdateStation, UpdateStationRequest } from '../../services/StationAPI';
import { ChargingStationDto, UserSummaryDto } from '../../types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { AddChargingPointModal } from '../../components/station/AddChargingPointModal';
import { AddCSStaffModal } from '../../components/csstaff/AddCSStaffModal';

interface AdminDashboardProps {
    onNavigate: (path: string) => void;
}

interface Station {
    id: number;
    name: string;
    location: string;
    ports: number;
    status: 'active' | 'maintenance' | 'offline';
    description?: string;
    operatingHours?: string;
}

enum FrontendStationStatus {
    ACTIVE = 'active',
    MAINTENANCE = 'maintenance',
    OFFLINE = 'offline'
}

type BackendStationStatus = 'AVAILABLE' | 'IN_USE' | 'OFFLINE' | 'FAULTED';

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
    const [isAddStationModalOpen, setIsAddStationModalOpen] = useState(false);
    const [isAddChargingPointModalOpen, setIsAddChargingPointModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [selectedStationId, setSelectedStationId] = useState<number | undefined>();
    const [stations, setStations] = useState<Station[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStation, setEditingStation] = useState<Station | null>(null);
    const [newStatus, setNewStatus] = useState<FrontendStationStatus>(FrontendStationStatus.ACTIVE);
    const [users, setUsers] = useState<UserSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [allStationsDto, setAllStationsDto] = useState<ChargingStationDto[]>([]); // (Cần DTO gốc cho Modal)

    const mapFrontendToBackendStatus = (status: FrontendStationStatus): BackendStationStatus => {
        switch (status) {
            case FrontendStationStatus.ACTIVE: return 'AVAILABLE';
            case FrontendStationStatus.MAINTENANCE: return 'IN_USE';
            case FrontendStationStatus.OFFLINE: return 'OFFLINE';
            default: return 'OFFLINE';
        }
    };

    const mapBackendToFrontendStatus = (status: BackendStationStatus): FrontendStationStatus => {
        switch (status) {
            case 'AVAILABLE': return FrontendStationStatus.ACTIVE;
            case 'IN_USE': return FrontendStationStatus.MAINTENANCE;
            case 'OFFLINE':
            case 'FAULTED':
                return FrontendStationStatus.OFFLINE;
            default: return FrontendStationStatus.OFFLINE;
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [stationsData, usersData] = await Promise.all([
                apiGetAllStations(),
                apiGetAllUsers()
            ]);

            setAllStationsDto(stationsData);

            const mappedStations: Station[] = stationsData.map((dto) => ({
                id: dto.stationId,
                name: dto.name,
                location: dto.location,
                ports: dto.totalChargingPoint,
                status: mapBackendToFrontendStatus(dto.status)
            }));
            setStations(mappedStations);
            setUsers(usersData);

        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
            toast.error("Không thể tải dữ liệu dashboard.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveStatus = async () => {
        if (!editingStation) return;
        try {
            const backendStatus = mapFrontendToBackendStatus(newStatus);
            const data: UpdateStationRequest = {
                name: editingStation.name,
                location: editingStation.location,
                status: backendStatus,
                totalChargingPoint: editingStation.ports,
                availableChargers: editingStation.ports,
            };
            const updatedStation = await apiUpdateStation(editingStation.id, data);
            toast.success('Cập nhật trạng thái thành công!');

            setStations((prev) =>
                prev.map((s) =>
                    s.id === editingStation.id
                        ? { ...s, status: mapBackendToFrontendStatus(updatedStation.status) }
                        : s
                )
            );
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error('Cập nhật thất bại!');
            console.error(err);
        }
    };

    const handleView = (station: Station) => {
        setSelectedStation(station);
        setIsModalOpen(true);
    };
    const handleEditStatus = (station: Station) => {
        setEditingStation(station);
        setNewStatus(station.status);
        setIsEditModalOpen(true);
    };

    const stats = [
        { icon: <DollarSign className="h-6 w-6" />, label: 'Total Revenue', value: '158,200,000₫', change: '+18.2%', trend: 'up', color: 'text-green-600', bgColor: 'bg-green-100', },
        { icon: <Users className="h-6 w-6" />, label: 'Active Users', value: '52,847', change: '+12.5%', trend: 'up', color: 'text-blue-600', bgColor: 'bg-blue-100', },
        { icon: <MapPin className="h-6 w-6" />, label: 'Total Stations', value: '547', change: '+23', trend: 'up', color: 'text-purple-600', bgColor: 'bg-purple-100', },
        { icon: <Zap className="h-6 w-6" />, label: 'Sessions Today', value: '3,482', change: '+8.1%', trend: 'up', color: 'text-[#0f766e]', bgColor: 'bg-[#0f766e]/10', },
    ];

    const handleExportReport = async () => {
        try {
            toast.success('Đang chuẩn bị tải xuống báo cáo...');
            await exportRevenueReport();
            toast.success('Báo cáo đã được tải xuống thành công!');
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Không thể tải xuống báo cáo. Vui lòng thử lại.');
        }
    };

    const handleAddStation = () => {
        setIsAddStationModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddStationModalOpen(false);
    };

    const handleAddStationSuccess = () => {
        toast.success('Trạm sạc đã được thêm thành công!');
        fetchData();
    };

    const handleAddChargingPoint = (stationId: number, stationName: string) => {
        setSelectedStationId(stationId);
        setIsAddChargingPointModalOpen(true);
        toast.info(`Thêm điểm sạc cho ${stationName}`);
    };

    const handleAddChargingPointSuccess = () => {
        toast.success('Điểm sạc đã được thêm thành công!');
    };

    const handleAddStaffSuccess = () => {
        toast.success('Nhân viên đã được thêm thành công!');
        fetchData();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (isLoading) {
        return <div className="p-6 text-center">Đang tải dữ liệu Admin Dashboard...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p className="text-gray-600">Comprehensive system overview and analytics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                    <Button className="bg-[#0f766e] hover:bg-[#0f766e]/90" onClick={handleAddStation}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Station
                    </Button>
                </div>
            </div>
            <p className="text-3xl mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Station */}
        <Card className="p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2>Revenue by Station</h2>
            <Badge variant="outline">Last 30 days</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByStation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="station" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="revenue" fill="#0f766e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Utilization by Hour */}
        <Card className="p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2>Utilization by Hour</h2>
            <Badge variant="outline">Today</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={utilizationByHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="utilization" stroke="#0f766e" strokeWidth={3} dot={{ fill: '#0f766e', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2>Charge Sessions</h2>
        </div>

        <div className="rounded-2xl border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Energy (kWh)</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.sessionId}>
                  <TableCell>{s.sessionId}</TableCell>
                  <TableCell>{s.cost}</TableCell>
                  <TableCell>{s.energyUsed}</TableCell>
                  <TableCell>{new Date(s.startTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(s.endTime).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        s.status === "COMPLETED"
                          ? "bg-green-500"
                          : s.status === "IN_PROGRESS"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.stationId}</TableCell>
                  <TableCell>{s.driverId}</TableCell>
                  <TableCell>{s.vehicleId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* AI Insights & Alerts */}
      <div className="grid  gap-6">
        {/* AI Suggestions */}
          <Card className="p-6 rounded-2xl w-full max-w-full">
          <div className="flex items-center justify-between mb-4">
            <h2>Station List</h2>
          </div>

          <div className="rounded-2xl border overflow-x-auto w-full">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>{station.location}</TableCell>
                    <TableCell>{station.ports}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          station.status === 'active'
                            ? 'bg-green-500'
                            : station.status === 'maintenance'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }
                      >
                        {station.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(station)}
                      >
                        View
                      </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditStatus(station)}
                        >
                          Edit
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2>Revenue by Station</h2>
                        <Badge variant="outline">Last 30 days</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueByStation}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="station" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            />
                            <Bar dataKey="revenue" fill="#0f766e" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2>Utilization by Hour</h2>
                        <Badge variant="outline">Today</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={utilizationByHour}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value: number) => `${value}%`}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            />
                            <Line type="monotone" dataKey="utilization" stroke="#0f766e" strokeWidth={3} dot={{ fill: '#0f766e', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="grid gap-6">
                <Card className="p-6 rounded-2xl w-full max-w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2>Station List</h2>
                    </div>
                    <div className="rounded-2xl border overflow-x-auto w-full">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Ports</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stations.map((station) => (
                                    <TableRow key={station.id}>
                                        <TableCell>{station.name}</TableCell>
                                        <TableCell>{station.location}</TableCell>
                                        <TableCell>{station.ports}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    station.status === 'active'
                                                        ? 'bg-green-500'
                                                        : station.status === 'maintenance'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                }
                                            >
                                                {station.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleView(station)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditStatus(station)}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {isModalOpen && selectedStation && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-11/12 max-w-xl relative text-center">
                            <h3 className="text-2xl font-semibold mb-4">{selectedStation.name}</h3>
                            <p><strong>Location:</strong> {selectedStation.location}</p>
                            <p><strong>Ports:</strong> {selectedStation.ports}</p>
                            <p>
                                <strong>Status:</strong>{' '}
                                <Badge
                                    className={
                                        selectedStation.status === 'active'
                                            ? 'bg-green-500'
                                            : selectedStation.status === 'maintenance'
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                    }
                                >
                                    {selectedStation.status}
                                </Badge>
                            </p>
                            <Button className="mt-4 mx-auto" onClick={() => setIsModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                )}

                {isEditModalOpen && editingStation && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md text-center">
                            <h3 className="text-lg font-semibold mb-4">
                                Chỉnh sửa trạng thái: {editingStation.name}
                            </h3>
                            <Select value={newStatus} onValueChange={(val) => setNewStatus(val as FrontendStationStatus)}>
                                <SelectTrigger className="w-full mb-4">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={FrontendStationStatus.ACTIVE}>Active</SelectItem>
                                    <SelectItem value={FrontendStationStatus.MAINTENANCE}>Maintenance</SelectItem>
                                    <SelectItem value={FrontendStationStatus.OFFLINE}>Offline</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                    Hủy
                                </Button>
                                <Button className="bg-[#0f766e]" onClick={handleSaveStatus}>
                                    Lưu
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2>Information Account</h2>
                    {/* (4) SỬA LỖI: Thay đổi nút "View All" */}
                    <Button variant="outline" onClick={() => setIsAddStaffModalOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Thêm Nhân viên
                    </Button>
                </div>
                <div className="rounded-2xl border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {user.role.replace('ROLE_', '').toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500">active</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <AddStationModal
                isOpen={isAddStationModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleAddStationSuccess}
            />
            <AddChargingPointModal
                isOpen={isAddChargingPointModalOpen}
                onClose={() => setIsAddChargingPointModalOpen(false)}
                onSuccess={handleAddChargingPointSuccess}
                preSelectedStationId={selectedStationId}
            />

            <AddCSStaffModal
                isOpen={isAddStaffModalOpen}
                onClose={() => setIsAddStaffModalOpen(false)}
                onSuccess={handleAddStaffSuccess}
                stations={allStationsDto}
            />
        </div>
    );
}