
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import "../../styles/globals.css"
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

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
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
    toast.info('Opening add station form...');
    onNavigate('/admin/stations/new');
  };

  const handleEditUser = (userId: string) => {
    toast.info(`Opening user editor for ${userId}`);
    // Open user edit modal or navigate to edit page
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Suggestions */}
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3>AI Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3">
              <p className="text-sm mb-1">Peak Hour Prediction</p>
              <p className="text-xs text-gray-600">
                Expected 35% surge in demand at Central Plaza between 18:00-20:00. Consider activating all ports.
              </p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-sm mb-1">Expansion Opportunity</p>
              <p className="text-xs text-gray-600">
                District 7 shows high search volume but limited stations. ROI estimated at 18 months.
              </p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-sm mb-1">Maintenance Alert</p>
              <p className="text-xs text-gray-600">
                3 stations approaching 10,000 session milestone. Schedule preventive maintenance.
              </p>
            </div>
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="p-6 rounded-2xl lg:col-span-2">
          <h2 className="mb-4">System Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-xl border ${
                  alert.type === 'error'
                    ? 'bg-red-50 border-red-200'
                    : alert.type === 'warning'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <AlertCircle
                  className={`h-5 w-5 flex-shrink-0 ${
                    alert.type === 'error'
                      ? 'text-red-600'
                      : alert.type === 'warning'
                      ? 'text-orange-600'
                      : 'text-blue-600'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2>Recent Users</h2>
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
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditUser(user.id)}
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
    </div>
  );
}
