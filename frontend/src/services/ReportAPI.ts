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
    periodStart: string;
    periodEnd: string;
    totalRevenue: number;
    totalEnergy: number;
    totalSessions: number;
    // stationId?: number;
    // generatedAt: string;
    station: { // Thay stationID bằng object station
        stationId:number;
        name :string;
        location :string;
    }
}

export interface GenerateReportRequest {
    stationId?: number;
    periodStart: string;
    periodEnd: string;
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

// Lấy reports theo khoảng thời gian
// export const getReportsByPeriod = async (start: string, end: string): Promise<Report[]> => {
//     // Chuyển đổi start và end sang định dạng ISO string without timezone
//     const startDate = new Date(start);
//     const endDate = new Date(end);

//     const formatToLocalDateTime = (date: Date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const hours = String(date.getHours()).padStart(2, '0');
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         const seconds = String(date.getSeconds()).padStart(2, '0');
//         return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//     };

//     const params = {
//         start: formatToLocalDateTime(startDate),
//         end: formatToLocalDateTime(endDate)
//     };

//     const response = await ReportAPI.get('/period', { params });
//     return response.data;
// };

// Lấy reports theo station và khoảng thời gian
// export const getReportsByStationAndPeriod = async (
//     stationId: number,
//     start: string,
//     end: string
// ): Promise<Report[]> => {
//     // Tương tự, chuyển đổi start và end
//     const startDate = new Date(start);
//     const endDate = new Date(end);

//     const formatToLocalDateTime = (date: Date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const hours = String(date.getHours()).padStart(2, '0');
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         const seconds = String(date.getSeconds()).padStart(2, '0');
//         return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//     };

//     const params = {
//         start: formatToLocalDateTime(startDate),
//         end: formatToLocalDateTime(endDate)
//     };

//     const response = await ReportAPI.get(`/station/${stationId}/period`, { params });
//     return response.data;
// };

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
    console.log('Sending report request:', data);
    const response = await ReportAPI.post('/revenue', data);
    console.log('Report created successfully:', response.data);
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
// export const exportRevenueReport = async (): Promise<void> => {
//     try {
//         const response = await ReportAPI.get('/sorted', {
//             // responseType: 'blob',
//         });

//         const blob = new Blob([response.data], { type: 'application/json' });
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
        
//         const timestamp = new Date().toISOString().split('T')[0];
//         link.setAttribute('download', `revenue-report-${timestamp}.json`);
        
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
//     } catch (error) {
//         console.error('Error exporting revenue report:', error);
//         throw error;
//     }
// };

export const exportRevenueReport = async (): Promise<void> => {
    try {
        console.log('Fetching data from MySQL via backend API...');
        
        // Gọi API backend để lấy dữ liệu từ MySQL
        const response = await ReportAPI.get('/sorted');
        const data = response.data;
        
        console.log('Data received from backend:', data);
        console.log('Total reports:', data.length);
        
        // Kiểm tra nếu không có dữ liệu
        if (!data || data.length === 0) {
            throw new Error('Không có dữ liệu báo cáo để export');
        }
        
        // Convert to JSON string với format đẹp
        // const jsonString = JSON.stringify(data, null, 2);

                // Tạo nội dung CSV thay vì JSON để dễ đọc
        const headers = ['ID', 'Loại', 'Trạm sạc', 'Vị trí', 'Bắt đầu', 'Kết thúc', 'Doanh thu', 'Năng lượng', 'Số phiên'];
        
        const csvContent = [
            headers.join(','),
            ...data.map((report: Report) => [
                report.reportId,
                report.reportType,
                `"${report.station.name}"`,
                `"${report.station.location}"`,
                report.periodStart,
                report.periodEnd,
                report.totalRevenue,
                report.totalEnergy,
                report.totalSessions
            ].join(','))
        ].join('\n');
        
        // Create blob
        // const blob = new Blob([jsonString], { type: 'application/json' });
        // const url = window.URL.createObjectURL(blob);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        
        // Create link và download
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `revenue-report-${timestamp}.json`;
        link.setAttribute('download', filename);
        
        console.log('Downloading file:', filename);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        window.URL.revokeObjectURL(url);
        console.log('Export completed successfully!');
        
    } catch (error) {
        console.error('Error exporting revenue report:', error);
        throw error;
    }
};



// Export report theo station
export const exportReportByStation = async (stationId: number): Promise<void> => {
    try {
        console.log('Fetching reports for station:', stationId);
        const response = await ReportAPI.get(`/station/${stationId}`);
        // responseType: 'blob',
         const data = response.data;
        
        if (!data || data.length === 0) {
            throw new Error(`Không có báo cáo nào cho trạm ID: ${stationId}`);
        }
        

        // const blob = new Blob([response.data], { type: 'application/json' });
        // const url = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url
        
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `station-${stationId}-report-${timestamp}.json`);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
         console.log('Export completed!');
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


// Format datetime theo định dạng dd/mm/yyyy HH:mm
export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
};

// Thêm response interceptor để debug lỗi
ReportAPI.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data);
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);
        return Promise.reject(error);
    }
);

export default ReportAPI;