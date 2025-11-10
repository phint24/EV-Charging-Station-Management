import axios from 'axios';

const ReportAPI = axios.create({
    baseURL: 'http://localhost:8080/api/reports',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự động thêm token vào mỗi request
ReportAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interfaces
export interface Report {
    reportId: number;
    reportType: 'REVENUE' | 'USAGE';
    startDate: string;
    endDate: string;
    totalRevenue: number;
    totalEnergy: number;
    totalSessions: number;
    stationId?: number;
    generatedAt: string;
}

export interface GenerateReportRequest {
    stationId?: number;
    startDate: string;
    endDate: string;
}


// Lấy tất cả reports
export const getAllReports = async (): Promise<Report[]> => {
    const response = await ReportAPI.get('');
    return response.data;
};

// Lấy report theo ID
export const getReportById = async (reportId: number): Promise<Report> => {
    const response = await ReportAPI.get(`/${reportId}`);
    return response.data;
};

// Lấy reports theo stationId
export const getReportsByStation = async (stationId: number): Promise<Report[]> => {
    const response = await ReportAPI.get(`/station/${stationId}`);
    return response.data;
};

// Lấy reports theo loại (REVENUE hoặc USAGE)
export const getReportsByType = async (reportType: 'REVENUE' | 'USAGE'): Promise<Report[]> => {
    const response = await ReportAPI.get(`/type/${reportType}`);
    return response.data;
};

// Lấy reports theo khoảng thời gian
export const getReportsByPeriod = async (start: string, end: string): Promise<Report[]> => {
    const response = await ReportAPI.get('/period', {
        params: { start, end }
    });
    return response.data;
};

// Lấy reports theo station và khoảng thời gian
export const getReportsByStationAndPeriod = async (
    stationId: number,
    start: string,
    end: string
): Promise<Report[]> => {
    const response = await ReportAPI.get(`/station/${stationId}/period`, {
        params: { start, end }
    });
    return response.data;
};

// Lấy report có doanh thu cao nhất
export const getTopRevenueReport = async (): Promise<Report> => {
    const response = await ReportAPI.get('/top-revenue');
    return response.data;
};

// Lấy report có năng lượng cao nhất
export const getTopEnergyReport = async (): Promise<Report> => {
    const response = await ReportAPI.get('/top-energy');
    return response.data;
};

// Lấy tất cả reports đã được sắp xếp theo ngày
export const getAllReportsSorted = async (): Promise<Report[]> => {
    const response = await ReportAPI.get('/sorted');
    return response.data;
};

// Lấy reports có số sessions tối thiểu
export const getReportsByMinSessions = async (minSessions: number): Promise<Report[]> => {
    const response = await ReportAPI.get(`/min-sessions/${minSessions}`);
    return response.data;
};

// Lấy reports theo khoảng doanh thu
export const getReportsByRevenueRange = async (
    minRevenue: number,
    maxRevenue: number
): Promise<Report[]> => {
    const response = await ReportAPI.get('/revenue-range', {
        params: { minRevenue, maxRevenue }
    });
    return response.data;
};


// Tạo revenue report mới
export const generateRevenueReport = async (data: GenerateReportRequest): Promise<Report> => {
    const response = await ReportAPI.post('/revenue', data);
    return response.data;
};

// Tạo usage report mới
export const generateUsageReport = async (data: GenerateReportRequest): Promise<Report> => {
    const response = await ReportAPI.post('/usage', data);
    return response.data;
};


// Xóa report theo ID
export const deleteReport = async (reportId: number): Promise<string> => {
    const response = await ReportAPI.delete(`/${reportId}`);
    return response.data;
};


// Export revenue report dưới dạng file JSON
export const exportRevenueReport = async (): Promise<void> => {
    try {
        const response = await ReportAPI.get('/sorted', {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `revenue-report-${timestamp}.json`);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting revenue report:', error);
        throw error;
    }
};

// Export report theo station
export const exportReportByStation = async (stationId: number): Promise<void> => {
    try {
        const response = await ReportAPI.get(`/station/${stationId}`, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `station-${stationId}-report-${timestamp}.json`);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting station report:', error);
        throw error;
    }
};

// Export report theo khoảng thời gian
export const exportReportByPeriod = async (start: string, end: string): Promise<void> => {
    try {
        const response = await ReportAPI.get('/period', {
            params: { start, end },
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `period-report-${timestamp}.json`);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting period report:', error);
        throw error;
    }
};


// Format currency theo định dạng VND
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

// Format date theo định dạng dd/mm/yyyy
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

// Format datetime theo định dạng dd/mm/yyyy HH:mm
export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
};

export default ReportAPI;