import { useState, useEffect } from 'react';
import { Wallet, Plus, CreditCard, Building2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import "../../styles/globals.css"

import { apiTopUpWallet, apiGetPaymentMethods } from '../../api/DriverAPI';
import { PaymentMethodDto, WalletTopUpRequest } from '../../types';

interface WalletPanelProps {
    balance: number;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onBalanceUpdate: (newBalance: number) => void;
}

export function WalletPanel({ balance, isOpen: externalIsOpen, onOpenChange, onBalanceUpdate }: WalletPanelProps) {
    const [internalIsTopUpOpen, setInternalIsOpen] = useState(false);
    const [amount, setAmount] = useState('');

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);
    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isTopUpOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsTopUpOpen;
    const setIsTopUpOpen = (open: boolean) => {
        if (onOpenChange) {
            onOpenChange(open);
        } else {
            setInternalIsOpen(open);
        }
    };

    useEffect(() => {
        if (isTopUpOpen) {
            const fetchMethods = async () => {
                try {
                    setIsLoading(true);
                    const methods = await apiGetPaymentMethods();
                    setPaymentMethods(methods);

                    const defaultMethod = methods.find(m => m.isDefault);
                    if (defaultMethod) {
                        setSelectedMethodId(defaultMethod.id);
                    } else if (methods.length > 0) {
                        setSelectedMethodId(methods[0].id);
                    }
                } catch (error) {
                    toast.error("Không thể tải phương thức thanh toán.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchMethods();
        }
    }, [isTopUpOpen]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const quickAmounts = [50000, 100000, 200000, 500000];

    const handleTopUp = async () => {
        const amountNum = parseInt(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            toast.error('Vui lòng nhập số tiền hợp lệ');
            return;
        }
        if (!selectedMethodId) {
            toast.error('Vui lòng chọn một phương thức thanh toán');
            return;
        }

        setIsLoading(true);

        const requestData: WalletTopUpRequest = {
            amount: amountNum,
            paymentMethodId: selectedMethodId
        };

        try {
            const response = await apiTopUpWallet(requestData);

            toast.success(`Đã nạp thành công ${formatCurrency(amountNum)}!`);
            onBalanceUpdate(response.newBalance);

            setIsTopUpOpen(false);
            setAmount('');
        } catch (error: any) {
            console.error("Top up failed:", error);
            let errorMessage = "Nạp tiền thất bại.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.message || error.response.data || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-[#0f766e] to-[#0ea5a4]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-white/80">
                        <Wallet className="h-5 w-5" />
                        <span>Wallet Balance</span>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                        Active
                    </Badge>
                </div>

                <div className="mb-6">
                    <p className="text-4xl text-white mb-1">{formatCurrency(balance)}</p>
                    <p className="text-sm text-white/70">Available for charging</p>
                </div>

                <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full bg-white text-[#0f766e] hover:bg-white/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Top Up Wallet
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Top Up Wallet</DialogTitle>
                        </DialogHeader>

                        {isLoading ? (
                            <div className="py-4 text-center">Đang tải phương thức thanh toán...</div>
                        ) : (
                            <div className="space-y-6 py-4">
                                <div>
                                    <Label className="mb-3 block">Quick Select</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {quickAmounts.map((quickAmount) => (
                                            <Button
                                                key={quickAmount}
                                                variant="outline"
                                                onClick={() => setAmount(quickAmount.toString())}
                                                className={amount === quickAmount.toString() ? 'border-[#0f766e] bg-[#0f766e]/5' : ''}
                                            >
                                                {formatCurrency(quickAmount)}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="amount" className="mb-3 block">
                                        Or Enter Custom Amount
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e:any) => setAmount(e.target.value)}
                                        min="1000"
                                        step="1000"
                                    />
                                </div>

                                <div>
                                    <Label className="mb-3 block">Payment Method</Label>
                                    <div className="space-y-3">
                                        {paymentMethods.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                Bạn chưa thêm phương thức thanh toán.
                                                <span className="text-[#0f766e] cursor-pointer" onClick={() => alert('Chuyển đến trang Thêm Thẻ')}> Thêm ngay</span>
                                            </p>
                                        ) : (
                                            paymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setSelectedMethodId(method.id)}
                                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                                        selectedMethodId === method.id
                                                            ? 'border-[#0f766e] bg-[#0f766e]/5'
                                                            : 'border-gray-200 hover:border-[#0f766e]/50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {method.type === 'CREDIT_CARD' ? <CreditCard className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                                                        <div>
                                                            <p className="font-medium">{method.provider}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {method.type.replace('_', ' ')}
                                                                {method.isDefault && <span className="text-xs text-green-600"> (Mặc định)</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {amount && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-600">Amount to add</span>
                                            <span>{formatCurrency(parseInt(amount) || 0)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>New Balance (Est.)</span>
                                            <span>{formatCurrency(balance + (parseInt(amount) || 0))}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setIsTopUpOpen(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleTopUp}
                                disabled={!amount || parseInt(amount) <= 0 || !selectedMethodId || isLoading}
                                className="flex-1 bg-[#0f766e] hover:bg-[#0f766e]/90"
                            >
                                {isLoading ? "Đang xử lý..." : "Confirm Top Up"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </Card>
        </>
    );
}