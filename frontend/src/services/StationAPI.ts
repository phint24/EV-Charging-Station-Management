import API from './api';
import {
    ChargingStationDto,
    ChargingPointDto
} from '../types';

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