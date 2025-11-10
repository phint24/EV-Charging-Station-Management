import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api/charge-sessions',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Lấy tất cả phiên sạc
export const getAllSessions = async () => {
    const res = await API.get('/');
    return res.data;
};

// Lấy chi tiết 1 phiên sạc theo ID
export const getSessionById = async (id: number) => {
    const res = await API.get(`/${id}`);
    return res.data;
};

// Bắt đầu phiên sạc mới
export const startSession = async (data: {
    driverId: number;
    stationId: number;
    startTime: string;
}) => {
    const res = await API.post('/', data);
    return res.data;
};

// Dừng phiên sạc
export const stopSession = async (id: number, data: { endTime: string }) => {
    const res = await API.post(`/${id}/stop`, data);
    return res.data;
};

// Xóa phiên sạc
export const deleteSession = async (id: number) => {
    const res = await API.delete(`/${id}`);
    return res.data;
};