import axios from 'axios';

const AuthAPI = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        AuthAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete AuthAPI.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

export interface AuthResponse {
    token: string;
    email: string;
    role: 'ROLE_ADMIN' | 'ROLE_CSSTAFF' | 'ROLE_EVDRIVER';
}

export const apiLogin = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await AuthAPI.post('/auth/login', { email, password });
    return response.data;
};


export const apiRegister = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await AuthAPI.post('/auth/register', { name, email, password });
    return response.data;
};

export default AuthAPI;