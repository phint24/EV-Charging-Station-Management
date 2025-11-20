import { useState } from 'react';
import { X, Car } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import axios from 'axios';

import { apiAddVehicle } from '../../api/DriverAPI';
import { CreateVehicleRequest, ConnectorType, VehicleDto } from '../../types';


interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newVehicle: VehicleDto) => void;
}

const connectorTypes: ConnectorType[] = ['CCS', 'CHADEMO', 'AC_TYPE_2', 'AC_TYPE_1'];

export function AddVehicleModal({ isOpen, onClose, onSuccess }: AddVehicleModalProps) {
    const [formData, setFormData] = useState<CreateVehicleRequest>({
        vehicleId: '',
        brand: '',
        model: '',
        batteryCapacity: 0,
        connectorType: 'CCS'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.vehicleId.trim()) newErrors.vehicleId = "Biển số xe không được để trống";
        if (!formData.brand.trim()) newErrors.brand = "Hãng xe không được để trống";
        if (!formData.model.trim()) newErrors.model = "Mẫu xe không được để trống";
        if (isNaN(formData.batteryCapacity) || formData.batteryCapacity <= 0) newErrors.batteryCapacity = "Dung lượng pin phải là số dương";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Vui lòng kiểm tra lại thông tin xe.");
            return;
        }

        setIsLoading(true);
        try {
            const dataToSend = {
                ...formData,
                batteryCapacity: Number(formData.batteryCapacity)
            };

            const newVehicle = await apiAddVehicle(dataToSend);
            toast.success(`Đã thêm xe ${newVehicle.brand} ${newVehicle.model}!`);

            onSuccess(newVehicle);
            onClose();

            setFormData({
                vehicleId: '', brand: '', model: '', batteryCapacity: 0, connectorType: 'CCS'
            });

        } catch (error: any) {
            console.error('Failed to add vehicle:', error);
            let errorMessage = "Không thể thêm xe.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Car /> Thêm phương tiện mới
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="vehicleId">Biển số xe (hoặc ID xe)</Label>
                        <Input
                            id="vehicleId"
                            name="vehicleId"
                            value={formData.vehicleId}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="VD: 51K-12345"
                        />
                        {errors.vehicleId && <p className="text-sm text-red-500 mt-1">{errors.vehicleId}</p>}
                    </div>
                    <div>
                        <Label htmlFor="brand">Hãng xe</Label>
                        <Input
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="VD: Vinfast"
                        />
                        {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
                    </div>
                    <div>
                        <Label htmlFor="model">Mẫu xe</Label>
                        <Input
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="VD: VF8"
                        />
                        {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
                    </div>
                    <div>
                        <Label htmlFor="batteryCapacity">Dung lượng pin (kWh)</Label>
                        <Input
                            id="batteryCapacity"
                            name="batteryCapacity"
                            type="number"
                            value={formData.batteryCapacity === 0 ? '' : formData.batteryCapacity}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="VD: 88"
                        />
                        {errors.batteryCapacity && <p className="text-sm text-red-500 mt-1">{errors.batteryCapacity}</p>}
                    </div>
                    <div>
                        <Label htmlFor="connectorType">Loại cổng sạc</Label>
                        <Select
                            value={formData.connectorType}
                            onValueChange={(value) => handleSelectChange('connectorType', value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn loại cổng sạc..." />
                            </SelectTrigger>
                            <SelectContent>
                                {connectorTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#0f766e] hover:bg-[#0f766e]/90"
                    >
                        {isLoading ? "Đang lưu..." : "Lưu Phương tiện"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}