import API from './api';
import {
    CSStaffResponseDto,
    CreateCSStaffRequest,
    UpdateCSStaffProfileRequest,
    BookingDto,
    BookingStatus
} from '../types';

export const apiCreateCSStaff = async (data: CreateCSStaffRequest): Promise<CSStaffResponseDto> => {
    const response = await API.post('/csstaffs', data);
    return response.data;
};

export const apiUpdateCSStaff = async (staffProfileId: number, data: UpdateCSStaffProfileRequest): Promise<CSStaffResponseDto> => {
    const response = await API.put(`/csstaffs/${staffProfileId}`, data);
    return response.data;
};

export const apiDeleteCSStaff = async (staffProfileId: number): Promise<void> => {
    await API.delete(`/csstaffs/${staffProfileId}`);
};

export const apiGetBookingsForStation = async (): Promise<BookingDto[]> => {
    const response = await API.get('/csstaffs/me/bookings');
    return response.data;
};

export const apiUpdateBookingStatus = async (bookingId: number, newStatus: BookingStatus): Promise<BookingDto> => {
    const response = await API.post(
        `/csstaffs/me/bookings/${bookingId}/status`,
        null,
        {
            params: { newStatus }
        }
    );
    return response.data;
};