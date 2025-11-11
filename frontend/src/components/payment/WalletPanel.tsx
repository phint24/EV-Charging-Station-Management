import { useState } from 'react';
import { Wallet, Plus, CreditCard, Building2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import "../../styles/globals.css"
interface WalletPanelProps {
  balance: number;
  onTopUp: (amount: number, method: 'card' | 'bank') => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WalletPanel({ balance, onTopUp, isOpen: externalIsOpen, onOpenChange }: WalletPanelProps) {
  // const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [internalIsTopUpOpen, setInternalIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank'>('card');

  const isTopUpOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsTopUpOpen;
  const setIsTopUpOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const quickAmounts = [50000, 100000, 200000, 500000];

  const handleTopUp = () => {
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    onTopUp(amountNum, selectedMethod);
    setIsTopUpOpen(false);
    setAmount('');
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

            <div className="space-y-6 py-4">
              {/* Quick Amounts */}
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

              {/* Custom Amount */}
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

              {/* Payment Method */}
              <div>
                <Label className="mb-3 block">Payment Method</Label>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedMethod('card')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[#0f766e] bg-[#0f766e]/5'
                        : 'border-gray-200 hover:border-[#0f766e]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p>Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, JCB</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('bank')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedMethod === 'bank'
                        ? 'border-[#0f766e] bg-[#0f766e]/5'
                        : 'border-gray-200 hover:border-[#0f766e]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5" />
                      <div>
                        <p>Bank Transfer</p>
                        <p className="text-sm text-gray-600">All major banks</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Summary */}
              {amount && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Amount to add</span>
                    <span>{formatCurrency(parseInt(amount) || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Processing fee</span>
                    <span className="text-sm">Free</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span>New Balance</span>
                      <span>{formatCurrency(balance + (parseInt(amount) || 0))}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setIsTopUpOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleTopUp}
                disabled={!amount || parseInt(amount) <= 0}
                className="flex-1 bg-[#0f766e] hover:bg-[#0f766e]/90"
              >
                Confirm Top Up
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
