import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import {
    apiCreateChargingPoint,
    apiGetAllStations,
    CreateChargingPointRequest,
    ConnectorType,
    ChargingPointStatus
} from '../../api/StationAPI';
import { ChargingStationDto } from '../../types';

interface AddChargingPointModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    preSelectedStationId?: number; // Nếu đã chọn station trước
}

export function AddChargingPointModal({ 
    isOpen, 
    onClose, 
    onSuccess,
    preSelectedStationId 
}: AddChargingPointModalProps) {
    const [stations, setStations] = useState<ChargingStationDto[]>([]);
    const [formData, setFormData] = useState({
        stationId: preSelectedStationId?.toString() || '',
        type: 'AC_TYPE_2' as ConnectorType,
        power: '',
        status: 'AVAILABLE' as ChargingPointStatus,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStations, setIsLoadingStations] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load danh sách stations khi modal mở
    useEffect(() => {
        if (isOpen) {
            loadStations();
        }
    }, [isOpen]);

    // Set preSelectedStationId nếu có
    useEffect(() => {
        if (preSelectedStationId) {
            setFormData(prev => ({
                ...prev,
                stationId: preSelectedStationId.toString()
            }));
        }
    }, [preSelectedStationId]);

    const loadStations = async () => {
        setIsLoadingStations(true);
        try {
            const data = await apiGetAllStations();
            setStations(data);
        } catch (error) {
            console.error('Error loading stations:', error);
            toast.error('Không thể tải danh sách trạm sạc');
        } finally {
            setIsLoadingStations(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error khi user nhập
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate stationId
        if (!formData.stationId) {
            newErrors.stationId = 'Vui lòng chọn trạm sạc';
        }

        // Validate power
        if (!formData.power) {
            newErrors.power = 'Công suất không được để trống';
        } else {
            const power = parseFloat(formData.power);
            if (isNaN(power) || power <= 0) {
                newErrors.power = 'Công suất phải là số dương';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin');
            return;
        }

        setIsLoading(true);
        try {
            const requestBody: CreateChargingPointRequest = {
                stationId: parseInt(formData.stationId),
                type: formData.type,
                power: parseFloat(formData.power),
                status: formData.status as "AVAILABLE" | "OFFLINE" | "FAULTED" | "CHARGING" | "RESERVED"

            };

            console.log('Creating charging point:', requestBody);

            const result = await apiCreateChargingPoint(requestBody);

            console.log('Charging point created:', result);
            toast.success('Thêm điểm sạc thành công!');

            // Reset form
            setFormData({
                stationId: preSelectedStationId?.toString() || '',
                type: 'CSS' as ConnectorType,
                power: '',
                status: 'AVAILABLE' as ChargingPointStatus,
            });
            setErrors({});

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Error creating charging point:', error);

            let errorMessage = 'Không thể thêm điểm sạc. Vui lòng thử lại.';

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);

                    if (error.response.status === 400) {
                        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';

                        if (error.response.data.errors) {
                            const backendErrors: Record<string, string> = {};
                            Object.entries(error.response.data.errors).forEach(([field, message]) => {
                                backendErrors[field] = message as string;
                            });
                            setErrors(backendErrors);
                        } else if (error.response.data.message) {
                            errorMessage = error.response.data.message;
                        }
                    } else if (error.response.status === 401) {
                        errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
                    } else if (error.response.status === 403) {
                        errorMessage = 'Bạn không có quyền thêm điểm sạc.';
                    } else if (error.response.status === 404) {
                        errorMessage = 'Không tìm thấy trạm sạc.';
                    } else if (error.response.status === 500) {
                        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
                    } else if (error.response.data?.message) {
                        errorMessage = error.response.data.message;
                    }
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    errorMessage = 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối.';
                }
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Thêm điểm sạc mới</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isLoading}
                            aria-label="Đóng"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-4" onKeyPress={handleKeyPress}>
                        {/* Station Selection */}
                        <div>
                            <Label htmlFor="stationId">
                                Trạm sạc <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="stationId"
                                name="stationId"
                                value={formData.stationId}
                                onChange={handleChange}
                                disabled={isLoading || isLoadingStations || !!preSelectedStationId}
                                className={`flex h-10 w-full rounded-md border ${
                                    errors.stationId ? 'border-red-500' : 'border-input'
                                } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                                <option value="">
                                    {isLoadingStations ? 'Đang tải...' : 'Chọn trạm sạc'}
                                </option>
                                {stations.map((station) => (
                                    <option key={station.stationId} value={station.stationId}>
                                        {station.name} - {station.location}
                                    </option>
                                ))}
                            </select>
                            {errors.stationId && (
                                <p className="text-sm text-red-500 mt-1">{errors.stationId}</p>
                            )}
                        </div>

                        {/* Connector Type */}
                        <div>
                            <Label htmlFor="type">
                                Loại đầu cắm <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="AC_TYPE_1">AC_TYPE_1 (J1772)</option>
                                <option value="AC_TYPE_2">AC_TYPE_2 (Mennekes)</option>
                                <option value="CCS">CCS (Combined Charging System)</option>
                                <option value="CHADEMO">CHADEMO</option>
                            </select>
                        </div>

                        {/* Power */}
                        <div>
                            <Label htmlFor="power">
                                Công suất (kW) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="power"
                                name="power"
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="VD: 7.4, 22, 50, 150"
                                value={formData.power}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={errors.power ? 'border-red-500' : ''}
                            />
                            {errors.power && (
                                <p className="text-sm text-red-500 mt-1">{errors.power}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Công suất sạc tính bằng kilowatt (kW)
                            </p>
                        </div>

                        {/* Status */}
                        <div>
                            <Label htmlFor="status">
                                Trạng thái <span className="text-red-500">*</span>
                            </Label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="AVAILABLE">Sẵn sàng (Available)</option>
                                <option value="CHARGING">Đang sạc (Charging)</option>
                                <option value="UNAVAILABLE">Không khả dụng (Unavailable)</option>
                                <option value="FAULTED">Bị lỗi (Faulted)</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                className="flex-1 bg-[#0f766e] hover:bg-[#0f766e]/90"
                                disabled={isLoading || isLoadingStations}
                            >
                                {isLoading ? 'Đang thêm...' : 'Thêm điểm sạc'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}