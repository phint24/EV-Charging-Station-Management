import API from './api';
import {
    CSStaffResponseDto,
    CreateCSStaffRequest,
    BookingDto,
    BookingStatus
} from '../types';

export const apiCreateCSStaff = async (data: CreateCSStaffRequest): Promise<CSStaffResponseDto> => {
    const response = await API.post('/csstaffs', data);
    return response.data;
};

export const apiDeleteCSStaff = async (data: CreateCSStaffRequest): Promise<CSStaffResponseDto> => {
    const response = await API.post('/csstaffs', data);
    return response.data;
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