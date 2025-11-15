import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Zap, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { apiGetChargingPointsByStationId, apiDeleteChargingPoint } from '../../services/StationAPI';
import { ChargingPointDto } from '../../types';
import { AddChargingPointModal } from './AddChargingPointModal';

interface StationChargingPointsProps {
    stationId: number;
    stationName: string;
}

export function StationChargingPoints({ stationId, stationName }: StationChargingPointsProps) {
    const [chargingPoints, setChargingPoints] = useState<ChargingPointDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        loadChargingPoints();
    }, [stationId]);

    const loadChargingPoints = async () => {
        setIsLoading(true);
        try {
            const data = await apiGetChargingPointsByStationId(stationId);
            setChargingPoints(data);
        } catch (error) {
            console.error('Error loading charging points:', error);
            toast.error('Không thể tải danh sách điểm sạc');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (pointId: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa điểm sạc này?')) {
            return;
        }

        try {
            await apiDeleteChargingPoint(pointId);
            toast.success('Xóa điểm sạc thành công!');
            loadChargingPoints(); // Reload list
        } catch (error) {
            console.error('Error deleting charging point:', error);
            toast.error('Không thể xóa điểm sạc');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            AVAILABLE: { label: 'Sẵn sàng', className: 'bg-green-500' },
            CHARGING: { label: 'Đang sạc', className: 'bg-blue-500' },
            UNAVAILABLE: { label: 'Không khả dụng', className: 'bg-gray-500' },
            FAULTED: { label: 'Bị lỗi', className: 'bg-red-500' },
        };
        
        const info = statusMap[status] || { label: status, className: 'bg-gray-500' };
        return <Badge className={info.className}>{info.label}</Badge>;
    };

    const getConnectorTypeLabel = (type: string) => {
        const typeMap: Record<string, string> = {
            AC_TYPE_1: 'AC_TYPE_1 (J1772)',
            AC_TYPE_2: 'AC_TYPE_2 (Mennekes)',
            CCS: 'CCS',
            CHADEMO: 'CHADEMO',
        };
        return typeMap[type] || type;
    };

    return (
        <div className="space-y-4">
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold">Điểm sạc tại {stationName}</h3>
                        <p className="text-sm text-gray-600">
                            Tổng số: {chargingPoints.length} điểm sạc
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#0f766e] hover:bg-[#0f766e]/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm điểm sạc
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Đang tải...</p>
                    </div>
                ) : chargingPoints.length === 0 ? (
                    <div className="text-center py-8">
                        <Zap className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-500">Chưa có điểm sạc nào</p>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-4"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm điểm sạc đầu tiên
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-2xl border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Loại đầu cắm</TableHead>
                                    <TableHead>Công suất</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chargingPoints.map((point) => (
                                    <TableRow key={point.chargingPointId}>
                                        <TableCell className="font-medium">
                                            #{point.chargingPointId}
                                        </TableCell>
                                        <TableCell>
                                            {getConnectorTypeLabel(point.type)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Zap className="h-4 w-4 text-yellow-500" />
                                                {point.power} kW
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(point.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        toast.info('Chức năng chỉnh sửa đang phát triển');
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(point.chargingPointId)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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

            {/* Add Charging Point Modal */}
            <AddChargingPointModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    loadChargingPoints();
                    toast.success('Danh sách điểm sạc đã được cập nhật');
                }}
                preSelectedStationId={stationId}
            />
        </div>
    );
}