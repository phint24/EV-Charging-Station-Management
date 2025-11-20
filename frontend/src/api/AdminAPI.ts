import API from './api';

export const apiDeleteAdmin = async (adminProfileId: number): Promise<void> => {
    await API.delete(`/admins/${adminProfileId}`);
};

export const apiGetAllAdmins = async (): Promise<any[]> => {
    const response = await API.get('/admins');
    return response.data;
};