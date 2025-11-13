import axios from 'axios';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
}

const API_BASE = 'http://localhost:8080/api/users'; // backend endpoint

export async function apiGetAllUsers(): Promise<UserDto[]> {
  const token = localStorage.getItem('token'); // lấy token đã lưu sau khi login
  const response = await axios.get(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}