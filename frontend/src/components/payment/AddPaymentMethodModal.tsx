import { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import axios from 'axios';

import { apiAddPaymentMethod } from '../../api/DriverAPI';
import { CreatePaymentMethodRequest, PaymentMethodDto, PaymentType } from '../../types';

interface AddPaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newMethod: PaymentMethodDto) => void;
    driverId: number;
}

const paymentTypes: PaymentType[] = ['CREDIT_CARD', 'E_WALLET', 'BANK_TRANSFER'];

export function AddPaymentMethodModal({ isOpen, onClose, onSuccess, driverId }: AddPaymentMethodModalProps) {

    const [provider, setProvider] = useState('');
    const [type, setType] = useState<PaymentType>('CREDIT_CARD');
    const [isDefault, setIsDefault] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!provider.trim()) newErrors.provider = "Tên nhà cung cấp (Provider) không được để trống";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Vui lòng kiểm tra lại thông tin.");
            return;
        }

        setIsLoading(true);

        const requestData: CreatePaymentMethodRequest = {
            driverId: driverId,
            provider: provider,
            type: type,
            isDefault: isDefault
        };

        try {
            const newMethod = await apiAddPaymentMethod(requestData);
            toast.success(`Đã thêm ${newMethod.provider}!`);

            onSuccess(newMethod);
            onClose();

            setProvider('');
            setIsDefault(false);
            setType('CREDIT_CARD');

        } catch (error: any) {
            console.error('Failed to add payment method:', error);
            let errorMessage = "Không thể thêm phương thức thanh toán.";
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
                        <CreditCard /> Thêm Phương thức Thanh toán
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="type">Loại</Label>
                        <Select
                            value={type}
                            onValueChange={(value: PaymentType) => setType(value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn loại..." />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="provider">Tên Nhà cung cấp</Label>
                        <Input
                            id="provider"
                            name="provider"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            disabled={isLoading}
                            placeholder="VD: Visa, Momo, Vietcombank"
                        />
                        {errors.provider && <p className="text-sm text-red-500 mt-1">{errors.provider}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isDefault"
                            checked={isDefault}
                            onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                            disabled={isLoading}
                        />
                        <Label
                            htmlFor="isDefault"
                            className="text-sm font-medium leading-none"
                        >
                            Đặt làm phương thức mặc định
                        </Label>
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
                        {isLoading ? "Đang lưu..." : "Lưu Phương thức"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}