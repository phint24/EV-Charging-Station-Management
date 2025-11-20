import { useState, useEffect } from 'react';
import { UserCog } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import axios from 'axios';

import { apiUpdateCSStaff } from '../../api/CSStaffAPI';
import { UpdateCSStaffProfileRequest, UserSummaryDto, ChargingStationDto } from '../../types';

interface EditCSStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    stations: ChargingStationDto[];
    staff: UserSummaryDto | null;
}

export function EditCSStaffModal({ isOpen, onClose, onSuccess, stations, staff }: EditCSStaffModalProps) {

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        stationId: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (staff) {
            let currentStationId = '';

            if (staff.stationId) {
                currentStationId = staff.stationId.toString();
            } else if (staff.assignedStation && staff.assignedStation.stationId) {
                currentStationId = staff.assignedStation.stationId.toString();
            }

            setFormData({
                name: staff.name,
                phoneNumber: '',
                stationId: currentStationId
            });
        }
    }, [staff]);

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

    const handleSubmit = async () => {
        if (!staff || !staff.id) {
            toast.error("Lỗi: Không tìm thấy User ID của nhân viên.");
            return;
        }

        setIsLoading(true);

        const requestData: UpdateCSStaffProfileRequest = {
            name: formData.name,
            phoneNumber: formData.phoneNumber || undefined,
            stationId: formData.stationId ? Number(formData.stationId) : undefined
        };

        try {
            await apiUpdateCSStaff(staff.id, requestData);
            toast.success(`Đã cập nhật nhân viên ${formData.name}!`);

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to update staff:', error);
            let errorMessage = "Không thể cập nhật nhân viên.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || error.response.data || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !staff) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" /> Cập nhật Nhân viên
                    </DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin cho tài khoản <strong>{staff.email}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Tên */}
                    <div>
                        <Label htmlFor="name">Họ tên</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <Label htmlFor="phoneNumber">Số điện thoại mới</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="Nhập SĐT mới (nếu cần thay đổi)"
                        />
                    </div>

                    {/* Chọn Trạm */}
                    <div>
                        <Label htmlFor="stationId">Chuyển công tác (Trạm sạc)</Label>
                        <Select
                            value={formData.stationId}
                            onValueChange={handleSelectChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạm sạc..." />
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
                        {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}