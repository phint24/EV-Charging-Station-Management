import API from './api';
import {
    ChargingStationDto,
    ChargingPointDto
} from '../types';

// Interface matching CreateStationRequest from backend, Thêm đoạn này 
export interface CreateStationRequest {
    name: string;
    location: string;
    status: 'AVAILABLE' | 'IN_USE' | 'OFFLINE';
    totalChargingPoint: number;
    availableChargers: number;
}

// Interface matching UpdateStationRequest from backend, Thêm đoạn này 
// export interface UpdateStationRequest {
//     name: string;
//     location: string;
//     status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
//     totalChargingPoint: number;
//     availableChargers: number;
// }
export interface UpdateStationRequest {
  name: string;
  location: string;
  status: 'AVAILABLE' | 'IN_USE' | 'OFFLINE'; // phải match backend enum
  totalChargingPoint: number;
  availableChargers: number;
}

export type ConnectorType = 'AC_TYPE_1' | 'AC_TYPE_2' | 'CCS' | 'CHADEMO';
export type ChargingPointStatus = 'AVAILABLE' | 'CHARGING' | 'UNAVAILABLE' | 'OFFLINE';

export interface CreateChargingPointRequest {
    stationId: number;
    type: 'CCS' | 'CHADEMO' | 'AC_TYPE_2' | 'AC_TYPE_1';
    power: number;
    status: 'AVAILABLE' | 'CHARGING' | 'RESERVED' | 'OFFLINE' | 'FAULTED';
}

export interface UpdateChargingPointRequest {
    type?: 'CCS' | 'CHADEMO' | 'AC_TYPE_2' | 'AC_TYPE_1';
    power?: number;
    status?: 'AVAILABLE' | 'CHARGING' | 'RESERVED' | 'OFFLINE' | 'FAULTED';
}

export const apiGetAllStations = async (): Promise<ChargingStationDto[]> => {
    const res = await API.get('/charging-stations');
    return res.data;
};

export const apiGetStationById = async (id: number): Promise<ChargingStationDto> => {
    const res = await API.get(`/charging-stations/${id}`);
    return res.data;
};

export const apiGetChargingPointsByStationId = async (stationId: number): Promise<ChargingPointDto[]> => {

    const res = await API.get('/charging-points', {
        params: {
            stationId: stationId
        }
    });
    return res.data;
};

// Create new station
export const apiCreateStation = async (data: CreateStationRequest): Promise<ChargingStationDto> => {
    const res = await API.post('/charging-stations', data);
    return res.data;
};

// Update station
export const apiUpdateStation = async (id: number, data: UpdateStationRequest): Promise<ChargingStationDto> => {
    const res = await API.put(`/charging-stations/${id}`, data);
    return res.data;
};

// Delete station
export const apiDeleteStation = async (id: number): Promise<void> => {
    await API.delete(`/charging-stations/${id}`);
};

export const apiGetAllChargingPoints = async (): Promise<ChargingPointDto[]> => {
    const res = await API.get('/charging-points');
    return res.data;
};

export const apiGetChargingPointById = async (id: number): Promise<ChargingPointDto> => {
    const res = await API.get(`/charging-points/${id}`);
    return res.data;
};

export const apiCreateChargingPoint = async (data: CreateChargingPointRequest): Promise<ChargingPointDto> => {
    const res = await API.post('/charging-points', data);
    return res.data;
};

export const apiUpdateChargingPoint = async (id: number, data: UpdateChargingPointRequest): Promise<ChargingPointDto> => {
    const res = await API.put(`/charging-points/${id}`, data);
    return res.data;
};

export const apiDeleteChargingPoint = async (id: number): Promise<void> => {
    await API.delete(`/charging-points/${id}`);
};
