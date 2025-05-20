import axios from "axios";
import { logout } from "../shared/hooks";

  const apiClient = axios.create({
      baseURL: 'http://localhost:3333/penguinManagement/v1/',
      timeout: 5000
  })

  apiClient.interceptors.request.use(
    (config) => {
      const useUserDetails = localStorage.getItem('user');

      if (useUserDetails) {
        const token = JSON.parse(useUserDetails).token;
        config.headers['x-token'] = token; 
      }

      return config;
    },
    (e) => {
      return Promise.reject(e);
    }
  );
  
  export const login = async (data) => {
    try {
        return await apiClient.post('auth/login', data)
    } catch (e) {
        return { error: true, e }
    }
}

export const register = async (data) => {
    try {
        return await apiClient.post('auth/register', data)
    } catch (e) {
        return { error: true, e }
    }
}
export const getHotels = async () => {
  try {
    const response = await apiClient.get('hotels');
    return response.data.hotels;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerHotelOwner = async (data) => {
  try {
      return await apiClient.post('auth/register-hotel-admin', data)
  } catch (e) {
      return { error: true, e }
  }
}


