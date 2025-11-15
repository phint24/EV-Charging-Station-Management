import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import axios from 'axios';

import { apiCreateCSStaff } from '../../services/CSStaffAPI';
import { CreateCSStaffRequest } from '../../types';
import { ChargingStationDto } from '../../types'; // (Dùng để chọn trạm)

interface AddCSStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newStaff: any) => void;
    stations: ChargingStationDto[]; // (Nhận danh sách trạm sạc từ Dashboard)
}

export function AddCSStaffModal({ isOpen, onClose, onSuccess, stations }: AddCSStaffModalProps) {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        stationId: '' // (Lưu ID trạm sạc dưới dạng string cho Select)
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

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            stationId: value
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
        if (!formData.email.trim()) newErrors.email = "Email không được để trống";
        if (!formData.password.trim()) newErrors.password = "Mật khẩu không được để trống";
        if (!formData.stationId) newErrors.stationId = "Vui lòng chọn trạm sạc";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Vui lòng kiểm tra lại thông tin.");
            return;
        }

        setIsLoading(true);

        const requestData: CreateCSStaffRequest = {
            ...formData,
            stationId: Number(formData.stationId) // Chuyển đổi sang số
        };

        try {
            const newStaff = await apiCreateCSStaff(requestData);
            toast.success(`Đã tạo nhân viên ${newStaff.userAccount.name}!`);

            onSuccess(newStaff);
            onClose();

            setFormData({ name: '', email: '', password: '', phoneNumber: '', stationId: '' });

        } catch (error: any) {
            console.error('Failed to create staff:', error);
            let errorMessage = "Không thể tạo nhân viên.";
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
                        <UserPlus /> Thêm Nhân viên Trạm sạc (CSStaff)
                    </DialogTitle>
                    <DialogDescription>
                        Tài khoản này sẽ được gán quyền cho một trạm sạc cụ thể.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="name">Họ tên</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="VD: Nguyễn Văn A"
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email Đăng nhập</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="VD: staff.A@example.com"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <Label htmlFor="phoneNumber">Số điện thoại (Tùy chọn)</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="VD: 0901234567"
                        />
                    </div>
                    <div>
                        <Label htmlFor="stationId">Gán vào Trạm sạc</Label>
                        <Select
                            value={formData.stationId}
                            onValueChange={handleSelectChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạm sạc để gán..." />
                            </SelectTrigger>
                            <SelectContent>
                                {stations.length === 0 ? (
                                    <SelectItem value="none" disabled>Không có trạm sạc nào</SelectItem>
                                ) : (
                                    stations.map(station => (
                                        <SelectItem key={station.stationId} value={station.stationId.toString()}>
                                            {station.name} (ID: {station.stationId})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {errors.stationId && <p className="text-sm text-red-500 mt-1">{errors.stationId}</p>}
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
                        {isLoading ? "Đang tạo..." : "Tạo Nhân viên"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}