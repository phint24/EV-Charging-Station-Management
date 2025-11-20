import API from './api';

import {
    ChargeSessionDto,
    CreateSessionData,
    StopSessionData
} from '../types';

export const apiGetAllSessions = async (): Promise<ChargeSessionDto[]> => {
    const res = await API.get('/charge-sessions');
    return res.data;
};

export const apiStartSession = async (data: CreateSessionData): Promise<ChargeSessionDto> => {
    try {
        const res = await API.post('/charge-sessions/start', data);
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 403) {
            throw new Error('Forbidden: Bạn không có quyền hoặc token đã hết hạn.');
        }
        throw error;
    }
};

export const apiStopSession = async (id: number, data: StopSessionData): Promise<ChargeSessionDto> => {
    const res = await API.post(`/charge-sessions/${id}/stop`, data);
    return res.data;
};