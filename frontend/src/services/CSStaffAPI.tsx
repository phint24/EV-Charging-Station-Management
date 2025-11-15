import API from './api';
import {
    CSStaffResponseDto,
    CreateCSStaffRequest
} from '../types';

export const apiCreateCSStaff = async (data: CreateCSStaffRequest): Promise<CSStaffResponseDto> => {
    const response = await API.post('/csstaffs', data);
    return response.data;
};
