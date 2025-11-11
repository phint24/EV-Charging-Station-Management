import API from './api';
import { AuthResponse } from '../types';

export const apiLogin = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
};

export const apiRegister = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await API.post('/auth/register', { name, email, password });
    return response.data;
};