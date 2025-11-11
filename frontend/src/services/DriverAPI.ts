import API from './api';
import {
    EVDriverProfileDto,
    CreateVehicleRequest,
    VehicleDto,
    WalletBalanceApiResponse
} from '../types';

export const apiGetDriverProfile = async (): Promise<EVDriverProfileDto> => {
    const response = await API.get('/evdrivers/me');
    return response.data;
};

export const apiAddVehicle = async (data: CreateVehicleRequest): Promise<VehicleDto> => {
    const response = await API.post('/evdrivers/me/vehicles', data);
    return response.data;
};

export const apiGetBalance = async (): Promise<WalletBalanceApiResponse> => {
    const response = await API.get('/evdrivers/me/wallet');
    return response.data;
};