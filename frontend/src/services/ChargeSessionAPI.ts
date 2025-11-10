
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api/charge-sessions',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn token từ localStorage
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export interface ChargeSessionDto {
  id: number;
  startTime: string;
  endTime?: string;
  energyUsed: number;
  currentCost: number;
  timeRemaining?: number;
  batteryLevel: number;
  station: {
    name: string;
  };
  connectorType: string;
}

export interface CreateSessionData {
  driverId: number;
  stationId: number;
  startTime: string;
}

export interface StopSessionData {
  endTime: string;
}

// Lấy tất cả phiên sạc
export const getAllSessions = async (): Promise<ChargeSessionDto[]> => {
  const res = await API.get('');
  return res.data;
};

// Bắt đầu phiên sạc mới
export const startSession = async (data: CreateSessionData): Promise<ChargeSessionDto> => {
  try {
    const res = await API.post('start', data);
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('Forbidden: You do not have permission or token expired.');
    }
    throw error;
  }
};

// Dừng phiên sạc
export const stopSession = async (id: number, data: StopSessionData): Promise<ChargeSessionDto> => {
  const res = await API.post(`${id}/stop`, data);
  return res.data;
};


// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:8080/api/charge-sessions',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// // Thêm interceptor để tự động gắn token từ localStorage
// API.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// });

// export interface ChargeSessionDto {
//   id: number;
//   startTime: string;
//   endTime?: string;
//   energyUsed: number;
//   currentCost: number;
//   timeRemaining?: number;
//   batteryLevel: number;
//   station: {
//     name: string;
//   };
//   connectorType: string;
//   // Thêm các trường khác nếu cần
// }
// export interface CreateSessionData {
//   driverId: number;
//   stationId: number;
//   startTime: string;
// }

// export interface StopSessionData {
//   endTime: string;
// }

// // Lấy tất cả phiên sạc
// export const getAllSessions = async (): Promise<ChargeSessionDto[]> => {
//   const res = await API.get('/');
//   return res.data;
// };

// // Lấy chi tiết 1 phiên sạc theo ID
// export const getSessionById = async (id: number): Promise<ChargeSessionDto> => {
//   const res = await API.get(`/${id}`);
//   return res.data;
// };

// // Bắt đầu phiên sạc mới
// export const startSession = async (data: CreateSessionData): Promise<ChargeSessionDto> => {
//   const res = await API.post('/', data);
//   return res.data;
// };

// // Dừng phiên sạc
// export const stopSession = async (id: number, data: StopSessionData): Promise<ChargeSessionDto> => {
//   const res = await API.post(`/${id}/stop`, data);
//   return res.data;
// };

// // Xóa phiên sạc
// export const deleteSession = async (id: number) => {
//   const res = await API.delete(`/${id}`);
//   return res.data;
// };
