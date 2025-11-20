import API from './api';
import { ChatHistoryDto } from '../types';

export const apiSendChatMessage = async (message: string): Promise<{ response: string; timestamp: number }> => {
    const response = await API.post('/chatbot/chat', { message });
    return response.data;
};

export const apiGetChatHistory = async (): Promise<ChatHistoryDto[]> => {
    const response = await API.get('/chatbot/history');
    return response.data;
};

export const apiClearChatHistory = async (): Promise<void> => {
    await API.delete('/chatbot/history');
};