import API from './api';
import {
    EVDriverProfileDto,
    CreateVehicleRequest,
    VehicleDto,
    WalletBalanceApiResponse, WalletTopUpRequest, PaymentMethodDto
} from '../types';

export const apiGetDriverProfile = async (): Promise<EVDriverProfileDto> => {
    const response = await API.get('/evdrivers/me');
    return response.data;
};

export const apiAddVehicle = async (data: CreateVehicleRequest): Promise<VehicleDto> => {
    const response = await API.post('/evdrivers/me/vehicles', data);
    return response.data;
};

export const apiDeleteVehicle = async (vehicleId: number): Promise<void> => {
    await API.delete(`/evdrivers/me/vehicles/${vehicleId}`);
};

export const apiGetBalance = async (): Promise<WalletBalanceApiResponse> => {
    const response = await API.get('/evdrivers/me/wallet');
    return response.data;
};

export const apiTopUpWallet = async (data: WalletTopUpRequest): Promise<WalletBalanceApiResponse> => {
    const response = await API.post('/evdrivers/me/wallet/top-up', data);
    return response.data;
};

export const apiGetPaymentMethods = async (): Promise<PaymentMethodDto[]> => {
    const response = await API.get('/payment-methods');
    return response.data;
};

