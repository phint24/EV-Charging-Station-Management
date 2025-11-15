import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { generateRevenueReport, generateUsageReport } from '../../services/ReportAPI';
import { apiGetAllStations } from '../../services/StationAPI';
import { ChargingStationDto } from '../../types';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GenerateReportModal({ isOpen, onClose, onSuccess }: GenerateReportModalProps) {
  const [formData, setFormData] = useState({
    stationId: '',
    periodStart: '',
    periodEnd: '',
    reportType: 'REVENUE' as 'REVENUE' | 'USAGE',
  });
  const [stations, setStations] = useState<ChargingStationDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStations, setIsLoadingStations] = useState(false);

  // Fetch danh sách stations khi modal mở
  useEffect(() => {
    if (isOpen) {
      fetchStations();
    }
  }, [isOpen]);

  const fetchStations = async () => {
    setIsLoadingStations(true);
    try {
      const data = await apiGetAllStations();
      setStations(data);
      console.log('Đã load', data.length, 'stations');
    } catch (error) {
      console.error('Error fetching stations:', error);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.stationId || !formData.periodStart || !formData.periodEnd) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
    if (new Date(formData.periodEnd) <= new Date(formData.periodStart)) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }

    setIsLoading(true);
    try {
      // Chuẩn bị data
      const reportData = {
        stationId: parseInt(formData.stationId),
        periodStart: formData.periodStart + 'T07:00:00',
        periodEnd: formData.periodEnd + 'T23:59:59',
      };

      console.log('Generating report with data:', reportData);
      
      // Gọi API tạo report
      let newReport;
      if (formData.reportType === 'REVENUE') {
        newReport = await generateRevenueReport(reportData);
      } else {
        newReport = await generateUsageReport(reportData);
      }
      
      console.log('Report created:', newReport);
      toast.success(`Tạo báo cáo ${formData.reportType} thành công!`);
      
      // Reset form
      setFormData({
        stationId: '',
        periodStart: '',
        periodEnd: '',
        reportType: 'REVENUE',
      });
      
      // Callback để refresh danh sách reports
      // onSuccess?.();
if (onSuccess) {
    console.log('Calling onSuccess...');
    await onSuccess();
    console.log('onSuccess completed');
}
      onClose();
      
    } catch (error: any) {
      console.error('Error generating report:', error);
      
      let errorMessage = 'Không thể tạo báo cáo. Vui lòng thử lại.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Lỗi: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Tạo báo cáo mới</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Report Type */}
            <div>
              <Label htmlFor="reportType">
                Loại báo cáo <span className="text-red-500">*</span>
              </Label>
              <select
                id="reportType"
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="REVENUE">Doanh thu (Revenue)</option>
                <option value="USAGE">Sử dụng (Usage)</option>
              </select>
            </div>

            {/* Station */}
            <div>
              <Label htmlFor="stationId">
                Trạm sạc <span className="text-red-500">*</span>
              </Label>
              <select
                id="stationId"
                name="stationId"
                value={formData.stationId}
                onChange={handleChange}
                disabled={isLoading || isLoadingStations}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
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
            </div>

            {/* Period Start */}
            <div>
              <Label htmlFor="periodStart">
                Từ ngày <span className="text-red-500">*</span>
              </Label>
              <Input
                id="periodStart"
                name="periodStart"
                type="date"
                value={formData.periodStart}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            {/* Period End */}
            <div>
              <Label htmlFor="periodEnd">
                Đến ngày <span className="text-red-500">*</span>
              </Label>
              <Input
                id="periodEnd"
                name="periodEnd"
                type="date"
                value={formData.periodEnd}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 Báo cáo sẽ được tạo dựa trên các phiên sạc đã hoàn thành trong khoảng thời gian đã chọn.
              </p>
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
                {isLoading ? 'Đang tạo...' : 'Tạo báo cáo'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}