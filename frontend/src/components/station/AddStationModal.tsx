import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { apiCreateStation, CreateStationRequest } from '../../api/StationAPI';
import axios from 'axios';

interface AddStationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

enum StationStatus {
    AVAILABLE = 'AVAILABLE',
    IN_USE = 'IN_USE',
    OFFLINE = 'OFFLINE',
    FAULTED = 'FAULTED'
}

type StationStatusType = 'AVAILABLE' | 'IN_USE' | 'OFFLINE' | 'FAULTED';

export function AddStationModal({ isOpen, onClose, onSuccess }: AddStationModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        status: StationStatus.AVAILABLE as StationStatusType,
        totalChargingPoint: '',
        availableChargers: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

        if (!formData.name.trim()) {
            newErrors.name = 'Tên trạm không được để trống';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Vị trí không được để trống';
        }

        if (!formData.totalChargingPoint) {
            newErrors.totalChargingPoint = 'Tổng số cổng sạc không được để trống';
        } else {
            const totalPoints = parseInt(formData.totalChargingPoint);
            if (isNaN(totalPoints) || totalPoints < 1) {
                newErrors.totalChargingPoint = 'Tổng số cổng sạc phải là số nguyên dương';
            }
        }

        if (!formData.availableChargers) {
            newErrors.availableChargers = 'Số cổng khả dụng không được để trống';
        } else {
            const availablePoints = parseInt(formData.availableChargers);
            const totalPoints = parseInt(formData.totalChargingPoint);

            if (isNaN(availablePoints) || availablePoints < 0) {
                newErrors.availableChargers = 'Số cổng khả dụng phải là số không âm';
            } else if (!isNaN(totalPoints) && availablePoints > totalPoints) {
                newErrors.availableChargers = 'Số cổng khả dụng không thể lớn hơn tổng số cổng';
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
            const requestBody: CreateStationRequest = {
                name: formData.name.trim(),
                location: formData.location.trim(),
                status: formData.status as 'AVAILABLE' | 'IN_USE' | 'OFFLINE',
                totalChargingPoint: parseInt(formData.totalChargingPoint),
                availableChargers: parseInt(formData.availableChargers)
            };

            console.log('Sending request:', requestBody);

            const result = await apiCreateStation(requestBody);

            console.log('Station created successfully:', result);
            toast.success('Thêm trạm sạc thành công!');

            setFormData({
                name: '',
                location: '',
                status: StationStatus.AVAILABLE as StationStatusType,
                totalChargingPoint: '',
                availableChargers: '',
            });
            setErrors({});

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Error creating station:', error);

            let errorMessage = 'Không thể thêm trạm sạc. Vui lòng thử lại.';

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
                            // Xử lý lỗi validation từ Backend (nếu nó trả về message thay vì object errors)
                            errorMessage = error.response.data.message;
                        }
                    } else if (error.response.status === 401) {
                        errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
                    } else if (error.response.status === 403) {
                        errorMessage = 'Bạn không có quyền thêm trạm sạc.';
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
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Thêm trạm sạc mới</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isLoading}
                            aria-label="Đóng"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4" onKeyPress={handleKeyPress}>
                        <div>
                            <Label htmlFor="name">
                                Tên trạm sạc <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="VD: Trạm sạc Central Plaza"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="location">
                                Vị trí <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                                value={formData.location}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={errors.location ? 'border-red-500' : ''}
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                            )}
                        </div>

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
                                <option value={StationStatus.AVAILABLE}>Sẵn sàng (Available)</option>
                                <option value={StationStatus.OFFLINE}>Ngoại tuyến (Offline)</option>
                                <option value={StationStatus.FAULTED}>Bị lỗi (Faulted)</option>
                                <option value={StationStatus.IN_USE}>Đang bận (In Use)</option>
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="totalChargingPoint">
                                Tổng số cổng sạc <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="totalChargingPoint"
                                name="totalChargingPoint"
                                type="number"
                                min="1"
                                placeholder="VD: 4"
                                value={formData.totalChargingPoint}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={errors.totalChargingPoint ? 'border-red-500' : ''}
                            />
                            {errors.totalChargingPoint && (
                                <p className="text-sm text-red-500 mt-1">{errors.totalChargingPoint}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="availableChargers">
                                Số cổng khả dụng <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="availableChargers"
                                name="availableChargers"
                                type="number"
                                min="0"
                                placeholder="VD: 4"
                                value={formData.availableChargers}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={errors.availableChargers ? 'border-red-500' : ''}
                            />
                            {errors.availableChargers && (
                                <p className="text-sm text-red-500 mt-1">{errors.availableChargers}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Số cổng khả dụng không được vượt quá tổng số cổng sạc
                            </p>
                        </div>

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
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang thêm...' : 'Thêm trạm sạc'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}