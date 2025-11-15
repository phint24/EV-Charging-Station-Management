import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Zap, MapPin, Users, DollarSign, Search, Play, StopCircle, AlertCircle } from 'lucide-react';
import { sampleStations } from '../../data/sample';
import { toast } from 'sonner';
import { apiGetAllSessions, apiStopSession, apiStartSession, apiGetActiveSessions , apiResumeSession} from '../../services/sessionAPI';
import { ChargeSessionDto } from '../../types';

interface StaffDashboardProps {
  onNavigate: (path: string) => void;
}

export function StaffDashboard({ onNavigate }: StaffDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  //const [activeSessions, setActiveSessions] = useState<ChargeSessionDto[]>([]);
  //const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<ChargeSessionDto[]>([]);
  const [loading, setLoading] = useState(false);
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

// Load sessions from backend
  // useEffect(() => {
  //   loadSessions();
  // }, []);

  // const loadSessions = async () => {
  //   try {
  //     const data = await apiGetActiveSessions();
  //     setActiveSessions(data);
  //   } catch (err) {
  //     toast.error("Không thể tải danh sách phiên sạc");
  //   }
  // };

  // Mock active sessions
  // const activeSessions = [
  //   {
  //     id: 'ses-001',
  //     userName: 'Nguyen Van A',
  //     stationName: 'Central Plaza',
  //     portId: 'P1',
  //     portType: 'CCS',
  //     startTime: '14:30',
  //     soc: 67,
  //     kWh: 32.5,
  //     cost: 146250,
  //     status: 'charging',
  //   },
  //   {
  //     id: 'ses-002',
  //     userName: 'Tran Thi B',
  //     stationName: 'Vincom Mega',
  //     portId: 'P2',
  //     portType: 'Type2',
  //     startTime: '15:10',
  //     soc: 45,
  //     kWh: 18.2,
  //     cost: 91000,
  //     status: 'charging',
  //   },
  //   {
  //     id: 'ses-003',
  //     userName: 'Le Van C',
  //     stationName: 'Central Plaza',
  //     portId: 'P3',
  //     portType: 'CHAdeMO',
  //     startTime: '15:45',
  //     soc: 23,
  //     kWh: 8.7,
  //     cost: 39150,
  //     status: 'charging',
  //   },
  // ];

  const stats = [
    {
      icon: <Zap className="h-5 w-5" />,
      label: 'Active Sessions',
      value: activeSessions.length.toString(),
      color: 'text-[#0f766e]',
      bgColor: 'bg-[#0f766e]/10',
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Stations Online',
      value: '12/15',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Customers Today',
      value: '47',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: 'Revenue Today',
      value: '2,450,000₫',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
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
//   const stopStatuses = ["ACTIVE", "CHARGING", "RUNNING"];
//   const startStatuses = ["STOPPED", "PAUSED", "PENDING"];

// const handleToggleSession = async (session: ChargeSessionDto) => {
//   try {
//     // Nhóm trạng thái có thể stop
//     if (stopStatuses.includes(session.status)) {
//       await apiStopSession(session.sessionId, { energyUsed: session.energyUsed || 0 });
//       toast.success("Session stopped");
//     } else if (startStatuses.includes(session.status)) {
//       await apiResumeSession(session.sessionId);
//       toast.success("Session resumed");
//     } else {
//       toast.error("Cannot start this session");
//       return;
//     }


//     await fetchSessions(); // refresh danh sách
//   } catch (err: any) {
//     console.error(err.response?.data || err);
//     toast.error(err.response?.data?.message || "Failed to toggle session");
//   }
// };





  const handleReportIncident = (stationId: string) => {
    toast.info('Incident report form opened');
    // Open incident report modal
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Staff Dashboard</h1>
        <p className="text-gray-600">Monitor and manage charging stations</p>
      </div>

      {/* Statistics */}
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
                    <Button
                      size="sm"
                      variant={s.status === "ACTIVE" ? "destructive" : "default"}
                      onClick={() => handleToggleSession(s)}
                    >
                      {s.status === "ACTIVE" ? "Stop" : "Start"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Station Management */}
      <Card className="p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2>Station Control</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {sampleStations.slice(0, 3).map((station) => (
            <Card key={station.id} className="p-4 rounded-xl border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3>{station.name}</h3>
                    <Badge
                      className={
                        station.status === 'online'
                          ? 'bg-green-500'
                          : station.status === 'offline'
                          ? 'bg-red-500'
                          : 'bg-orange-500'
                      }
                    >
                      {station.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{station.address}</p>

                  {/* Ports Control */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {station.ports.map((port) => (
                      <div
                        key={port.id}
                        className="flex items-center justify-between p-2 rounded-lg border bg-gray-50"
                      >
                        <div>
                          <p className="text-sm">{port.type}</p>
                          <p className="text-xs text-gray-500">{port.power}kW</p>
                        </div>
                        <Switch
                          checked={port.status !== 'offline'}
                          onCheckedChange={(enabled) =>
                            handleTogglePort(port.id, enabled)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigate(`/staff/station/${station.id}`)}
                  >
                    Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReportIncident(station.id)}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Report
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
