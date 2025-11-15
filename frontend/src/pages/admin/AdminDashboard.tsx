import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import "../../styles/globals.css"
import { apiGetAllUsers, UserDto } from '../../services/UserAPI';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MapPin, DollarSign, Zap, AlertCircle, Download, Plus } from 'lucide-react';
import { revenueByStation, utilizationByHour } from '../../data/sample';
import { toast } from 'sonner';
import { exportRevenueReport } from '../../services/ReportAPI';
import { AddStationModal } from '../../components/station/AddStationModal'; 
import { apiGetAllStations, apiUpdateStation, UpdateStationRequest } from '../../services/StationAPI';
import { ChargingStationDto } from '../../types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { AddChargingPointModal } from '../../components/station/AddChargingPointModal';
import { apiGetAllChargingPoints, apiUpdateChargingPoint} from '../../services/StationAPI';
import { GenerateReportModal } from '../../components/report/GenerateReportModal';
import { 
  getAllReports, 
  deleteReport,
  Report,
  formatCurrency,
  formatDateTime 
} from '../../services/ReportAPI';



interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}
interface Station {
  id: number;
  name: string;
  location: string;
  ports: number;
  status: 'AVAILABLE' | 'IN_USE' | 'OFFLINE';
  description?: string;
  operatingHours?: string;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [isAddStationModalOpen, setIsAddStationModalOpen] = useState(false); 
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [isAddChargingPointModalOpen, setIsAddChargingPointModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<number | undefined>(); // Thêm dòng này 
  const [stations, setStations] = useState<Station[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [newStatus, setNewStatus] = useState<'AVAILABLE' | 'IN_USE' | 'OFFLINE'>('AVAILABLE');
  const [users, setUsers] = useState<UserDto[]>([]);

  useEffect(() => {
    fetchReports();
}, []);

  const fetchReports = async () => {
    setIsLoadingReports(true);
    try {
        console.log('Fetching reports...');
        const data = await getAllReports();
        console.log('Reports data received:', data);
        setReports(data);
        console.log('Đã load', data.length, 'reports');
    } catch (error) {
        console.error('Lỗi khi load reports:', error);
        toast.error('Không thể tải danh sách báo cáo');
    } finally {
        setIsLoadingReports(false);
    }
};


//   const mapFrontendToBackendStatus = (status: 'AVAILABLE' | 'IN_USE' | 'OFFLINE'): 'AVAILABLE' | 'IN_USE' | 'OFFLINE' => {
//   return status === 'AVAILABLE'
//     ? 'AVAILABLE'
//     : status === 'IN_USE'
//     ? 'IN_USE'
//     : 'OFFLINE';
// };
// const mapBackendToFrontendStatus = (status: 'AVAILABLE' | 'IN_USE' | 'OFFLINE' | 'FAULTED') =>
//   status === 'AVAILABLE'
//     ? 'AVAILABLE'
//     : status === 'IN_USE'
//     ? 'IN_USE'
//     : 'OFFLINE'; 
useEffect(() => {
  const fetchStations = async () => {
    try {
      const data: ChargingStationDto[] = await apiGetAllStations();
      const mappedStations: Station[] = data.map((dto) => ({
        id: dto.stationId,
        name: dto.name,
        location: dto.location,
        ports: dto.totalChargingPoint,
        status:
          dto.status === 'AVAILABLE'
            ? 'AVAILABLE'
            : dto.status === 'IN_USE'
            ? 'IN_USE'
            : 'OFFLINE', 
        description: undefined,
        operatingHours: undefined,
      }));
      setStations(mappedStations);
    } catch (err) {
      console.error('Failed to fetch stations', err);
    }
  };
    fetchStations();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGetAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();
  }, []);

  const handleSaveStatus = async () => {
  if (!editingStation) return;

  try {
    // const backendStatus = mapFrontendToBackendStatus(newStatus);
    const data: UpdateStationRequest = {
      name: editingStation.name,              
      location: editingStation.location,     
      status: newStatus,                  
      totalChargingPoint: editingStation.ports,  
      availableChargers: editingStation.ports,    
    };
    await apiUpdateStation(editingStation.id, data);
     // Refetch lại danh sách stations từ backend
    const updatedData = await apiGetAllStations();
    const mappedStations: Station[] = updatedData.map((dto) => ({
      id: dto.stationId,
      name: dto.name,
      location: dto.location,
      ports: dto.totalChargingPoint,
      status: dto.status as 'AVAILABLE' | 'IN_USE' | 'OFFLINE',
      description: undefined,
      operatingHours: undefined,
    }));
    setStations(mappedStations);
    // const updatedStation = await apiUpdateStation(editingStation.id, data);
    toast.success('Cập nhật trạng thái thành công!');
    // setStations((prev) =>
    //   prev.map((s) =>
    //     s.id === editingStation.id
    //       ? { ...s, status: newStatus }
    //       : s
    //   )
    // );

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
    {
      icon: <DollarSign className="h-6 w-6" />,
      label: 'Total Revenue',
      value: '158,200,000₫',
      change: '+18.2%',
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: 'Active Users',
      value: '52,847',
      change: '+12.5%',
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      label: 'Total Stations',
      value: '547',
      change: '+23',
      trend: 'up',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      label: 'Sessions Today',
      value: '3,482',
      change: '+8.1%',
      trend: 'up',
      color: 'text-[#0f766e]',
      bgColor: 'bg-[#0f766e]/10',
    },
  ];

  // Mock recent stations (thêm stationId)
  // const recentStations = [
  //   { id: 1, name: 'Trạm sạc Central Plaza', location: 'Quận 1, TP.HCM', status: 'active', totalPorts: 8, availablePorts: 5 },
  //   { id: 2, name: 'Trạm sạc Vincom Mega', location: 'Quận 2, TP.HCM', status: 'active', totalPorts: 6, availablePorts: 2 },
  //   { id: 3, name: 'Trạm sạc Tech Park', location: 'Quận 9, TP.HCM', status: 'offline', totalPorts: 4, availablePorts: 0 },
  // ];

  // Mock recent users
  const recentUsers = [
    { id: 'u-001', name: 'Nguyen Van A', email: 'nguyenvana@email.com', role: 'driver', status: 'active', joined: '2025-10-20' },
    { id: 'u-002', name: 'Tran Thi B', email: 'tranthib@email.com', role: 'driver', status: 'active', joined: '2025-10-21' },
    { id: 'u-003', name: 'Le Van C', email: 'levanc@email.com', role: 'staff', status: 'active', joined: '2025-10-22' },
    { id: 'u-004', name: 'Pham Thi D', email: 'phamthid@email.com', role: 'driver', status: 'inactive', joined: '2025-10-23' },
  ];
  // Mock alerts
  const alerts = [
    { id: 'a-001', type: 'warning', message: 'Station "Tech Park" offline for 2 hours', time: '15 min ago' },
    { id: 'a-002', type: 'info', message: 'High demand expected at Central Plaza (18:00-20:00)', time: '1 hour ago' },
    { id: 'a-003', type: 'error', message: 'Port P2 at Vincom Mega reported faulty', time: '2 hours ago' },
  ];

  // const handleExportReport = async () => {
  //   try {
  //     toast.success('Đang chuẩn bị tải xuống báo cáo...');
  //     await exportRevenueReport();
  //     toast.success('Báo cáo đã được tải xuống thành công!');
  //   } catch (error) {
  //     console.error('Export failed:', error);
  //     toast.error('Không thể tải xuống báo cáo. Vui lòng thử lại.');
  //   }
    
  // };
  const handleExportReport = async () => {
    try {
        if (reports.length === 0) {
            toast.error('Chưa có báo cáo nào để export. Hãy tạo báo cáo trước!');
            setIsGenerateReportModalOpen(true);
            return;
        }
        
        toast.success('Đang chuẩn bị tải xuống báo cáo...');
        await exportRevenueReport();
        toast.success(`Đã tải xuống ${reports.length} báo cáo thành công!`);
    } catch (error) {
        console.error('Export failed:', error);
        toast.error('Không thể tải xuống báo cáo. Vui lòng thử lại.');
    }
};


const handleGenerateReport = () => {
    setIsGenerateReportModalOpen(true);
};

const handleCloseGenerateReportModal = () => {
    setIsGenerateReportModalOpen(false);
};

const handleGenerateReportSuccess = async () => {
    console.log('handleGenerateReportSuccess called');
    toast.success('Báo cáo đã được tạo thành công!');

    setIsLoadingReports(true);

    try {
        console.log('Fetching reports...');
        const data = await getAllReports();

        // KHÔNG cần mapping lại, vì data từ API đã đúng format
        console.log('Raw reports data:', data);
        setReports(data);
        console.log('Đã refresh danh sách reports:', data.length, 'báo cáo');

    } catch (error) {
        console.error('Failed to refresh reports', error);
        toast.error('Không thể tải lại danh sách báo cáo');
    } finally {
        setIsLoadingReports(false);
    }
};


const handleDeleteReport = async (reportId: number) => {
    if (!confirm('Bạn có chắc muốn xóa báo cáo này?')) return;
    
    try {
        await deleteReport(reportId);
        toast.success('Đã xóa báo cáo');
        fetchReports(); // Refresh danh sách
    } catch (error) {
        console.error('Error deleting report:', error);
        toast.error('Không thể xóa báo cáo');
    }
};

  const handleAddStation = () => {
    setIsAddStationModalOpen(true);
};

const handleCloseModal = () => {
    setIsAddStationModalOpen(false);
};

const handleAddStationSuccess = async () => {
    toast.success('Trạm sạc đã được thêm thành công!');
        // Refresh station list
    try {
      const data = await apiGetAllStations();
      const mappedStations: Station[] = data.map((dto) => ({
        id: dto.stationId,
        name: dto.name,
        location: dto.location,
        ports: dto.totalChargingPoint,
        status: dto.status as 'AVAILABLE' | 'IN_USE' | 'OFFLINE',
        description: undefined,
        operatingHours: undefined,
      }));
      setStations(mappedStations);
    } catch (err) {
      console.error('Failed to refresh stations', err);
    }
};

 const handleAddChargingPoint = (stationId: number, stationName: string) => {
    setSelectedStationId(stationId);
    setIsAddChargingPointModalOpen(true);
    toast.info(`Thêm điểm sạc cho ${stationName}`);
  };

  const handleAddChargingPointSuccess = async () => {
    toast.success('Điểm sạc đã được thêm thành công!');
    // TODO: Refresh charging points list
        // Refresh station list để cập nhật số lượng cổng
    try {
      const data = await apiGetAllStations();
      const mappedStations: Station[] = data.map((dto) => ({
        id: dto.stationId,
        name: dto.name,
        location: dto.location,
        ports: dto.totalChargingPoint,
        status: dto.status as 'AVAILABLE' | 'IN_USE' | 'OFFLINE',
        description: undefined,
        operatingHours: undefined,
      }));
      setStations(mappedStations);
      console.log('Đã refresh danh sách stations sau khi thêm điểm sạc');
    } catch (err) {
      console.error('Failed to refresh stations after adding charging point', err);
      toast.error('Không thể tải lại danh sách trạm sạc');
    }
  };

  const handleEditUser = (userId: string) => {
    toast.info(`Opening user editor for ${userId}`);
    // Open user edit modal or navigate to edit page
  };

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  // };

  // const formatDateTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString('vi-VN');
  // };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-gray-600">Comprehensive system overview and analytics</p>
        </div>
        <div className="flex gap-2">
  <Button variant="outline" onClick={handleGenerateReport}>
    <Plus className="mr-2 h-4 w-4" />
    Generate Report
  </Button>
  <Button variant="outline" onClick={handleExportReport}>
    <Download className="mr-2 h-4 w-4" />
    Export Report ({reports.length})
  </Button>
  <Button className="bg-[#0f766e] hover:bg-[#0f766e]/90" onClick={handleAddStation}>
    <Plus className="mr-2 h-4 w-4" />
    Add Station
  </Button>
</div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
              <Badge variant={stat.trend === 'up' ? 'default' : 'destructive'} className={stat.trend === 'up' ? 'bg-green-500' : ''}>
                {stat.change}
              </Badge>
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

      {/* AI Insights & Alerts */}
      <div className="grid  gap-6">
        {/* AI Suggestions */}
          <Card className="p-6 rounded-2xl w-full max-w-full">
          <div className="flex items-center justify-between mb-4">
            <h2>Station List</h2>
            <Button variant="outline" onClick={() => onNavigate('/admin/stations')}>
            View All Stations
            </Button>
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
                          station.status === 'AVAILABLE'
                            ? 'bg-green-500'
                            : station.status === 'IN_USE'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }
                      >
                        {station.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddChargingPoint(station.id, station.name)}
                        className="text-[#0f766e] hover:text-[#0f766e] hover:bg-[#0f766e]/10"
                      >
                        <Zap className="mr-1 h-4 w-4" />
                        Thêm điểm sạc
                      </Button>
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
                      </div>
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
                    selectedStation.status === 'AVAILABLE'
                      ? 'bg-green-500'
                      : selectedStation.status === 'IN_USE'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }
                >
                  {selectedStation.status}
                </Badge>
              </p>
              {selectedStation.description && <p><strong>Description:</strong> {selectedStation.description}</p>}
              {selectedStation.operatingHours && <p><strong>Operating Hours:</strong> {selectedStation.operatingHours}</p>}

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

              <Select value={newStatus} onValueChange={(val) => setNewStatus(val as any)}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE"> Available</SelectItem>
                  <SelectItem value="IN_USE"> In_use</SelectItem>
                  <SelectItem value="OFFLINE"> Offline</SelectItem>
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


      {/* Recent Users */}
      <Card className="p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2>Information Account</h2>
          <Button variant="outline" onClick={() => onNavigate('/admin/users')}>
            View All
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
                {/* <TableHead>Joined</TableHead> */}
                {/* <TableHead>Actions</TableHead> */}
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
                  {/* <TableCell>2025-11-01</TableCell> tạm thời mock ngày */}
                  <TableCell>
                    {/* <Button size="sm" variant="ghost" onClick={() => handleEditUser(user.id.toString())}>
                      Edit
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

            {/* Reports List */}
      <Card className="p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2>Danh sách báo cáo</h2>
          <Badge variant="outline">
            {isLoadingReports ? 'Đang tải...' : `${reports.length} báo cáo`}
          </Badge>
        </div>
        
        {isLoadingReports ? (
          <div className="text-center py-8 text-gray-500">
            Đang tải danh sách báo cáo...
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Chưa có báo cáo nào. Hãy tạo báo cáo mới!</p>
            <Button onClick={handleGenerateReport} className="bg-[#0f766e]">
              <Plus className="mr-2 h-4 w-4" />
              Tạo báo cáo đầu tiên
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạm sạc</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Năng lượng</TableHead>
                  <TableHead>Phiên sạc</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.reportId}>
                    <TableCell className="font-medium">#{report.reportId}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          report.reportType === 'REVENUE' 
                            ? 'bg-green-500' 
                            : 'bg-blue-500'
                        }
                      >
                        {report.reportType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.station.name}</p>
                        <p className="text-xs text-gray-500">{report.station.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p>{formatDateTime(report.periodStart)}</p>
                        <p className="text-gray-500">đến</p>
                        <p>{formatDateTime(report.periodEnd)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(report.totalRevenue)}
                    </TableCell>
                    <TableCell>
                      {report.totalEnergy !== undefined && report.totalEnergy !== null
                        ? report.totalEnergy.toLocaleString()
                        : "0"
                      } kWh
                    </TableCell>
                    <TableCell>
                      {report.totalSessions}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteReport(report.reportId)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isGenerateReportModalOpen}
        onClose={handleCloseGenerateReportModal}
        onSuccess={handleGenerateReportSuccess}
      />
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
    </div>
  );
}
