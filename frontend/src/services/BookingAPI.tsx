import API from './api';
import { BookingDto, CreateBookingRequest } from '../types';

export const apiCreateBooking = async (data: CreateBookingRequest): Promise<BookingDto> => {
    const res = await API.post('/bookings', data);
    return res.data;
};

export const apiGetMyBookings = async (): Promise<BookingDto[]> => {
    const res = await API.get('/bookings/me');
    return res.data;
};

export const apiCancelBooking = async (bookingId: number): Promise<BookingDto> => {
    const res = await API.post(`/bookings/${bookingId}/cancel`);
    return res.data;
};