import axios from "axios";
import { logout } from "../shared/hooks";

const apiClient = axios.create({
  baseURL: 'http://localhost:3333/penguinManagement/v1/',
  timeout: 5000
});

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
    return await apiClient.post('auth/login', data);
  } catch (e) {
    return { error: true, e };
  }
};

export const register = async (data) => {
  try {
    return await apiClient.post('auth/register', data);
  } catch (e) {
    return { error: true, e };
  }
};

export const getHotels = async () => {
  try {
    const response = await apiClient.get('hotels');
    return response.data.hotels;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getHotelsByName = async (name) => {
  try {
    const response = await apiClient.get(`hotels/get-hotel-by-name/${name}`);
    console.log("Respuesta completa del backend:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error en getHotelsByName:", error);
    throw error;
  }
};

export const registerHotelOwner = async (data) => {
  try {
    return await apiClient.post('auth/register-hotel-admin', data);
  } catch (e) {
    return { error: true, e };
  }
};

export const getUsers = async (state) => {
  try {
    const url = state !== undefined ? `users/listar?state=${state}` : 'users/listar';
    const response = await apiClient.get(url);
    return response.data.users;  
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    throw error;
  }
};

export const acceptUser = async (id) => {
  try {
    const response = await apiClient.put(`users/aceptar/${id}`);
    return response.data; 
  } catch (error) {
    console.error("Error al aceptar usuario:", error);
    throw error;
  }
};

export const getReservations = async (role) => {
  try {
    let url = '';

    if (role === 'ADMIN') {
      url = 'reservations/admin';
    } else if (role === 'CLIENT') {
      url = 'reservations/client';
    } else if (role === 'HOTEL') {
      url = 'reservations/hotel';
    } else {
      console.warn(`Rol no soportado: ${role}`);
      url = 'reservations/client'; 
    }

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las reservaciones:", error);
    throw error;
  }
};

export const addHotel = async (hotelData) => {
  try {
    const response = await apiClient.post("hotels/add-hotel/", hotelData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar hotel:", error);
    throw error;
  }
};

export const addReservation = async (hotelId, reservationData) => {
  try {
    const response = await apiClient.post(`reservations/reservation/${hotelId}`, reservationData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar reservación:", error);
    throw error;
  }
};

export const createInvoice = async ({ hotelId, diasEstadia }) => {
  try {
    const response = await apiClient.post('invoice/create', {
      hotelId,
      diasEstadia: Number(diasEstadia),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear factura:", error);
    throw error;
  }
};

export const createInvoiceEvent = async ({ eventData }) => {
  try {
    const response = await apiClient.post('invoice/create/event', {eventData});
    return response.data;
  } catch (error) {
    console.error("Error al crear factura:", error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await apiClient.post('events/', {
      ...eventData,
      diasEstadia: Number(eventData.diasEstadia),
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear evento:", error);
    throw error;
  }
};

export const removeRoomsFromReservation = async (roomList) => {
  try {
    const response = await apiClient.delete('reservations/delete-rooms', {
      data: { roomList },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar habitaciones:", error);
    throw error;
  }
};

export const getInvoices = async (role) => {
  try {
    let url = '';

    if (role === 'ADMIN') {
      url = 'invoice/admin';
    } else if (role === 'CLIENT') {
      url = 'invoice/client';
    } else if (role === 'HOTEL') {
      url = 'invoice/hotel';
    } else {
      console.warn(`Rol no soportado: ${role}`);
      url = 'invoice/client';
    }

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    throw error;
  }
};

export const updateHotelById = async (id, data) => {
  try {
    const response = await apiClient.put(`hotels/update-hotel/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar hotel:", error);
    throw error;
  }
};

export const addRoom = async (roomData) => {
  try {
    const response = await apiClient.post("rooms/", roomData);
    return response.data;
  } catch (error) {
    console.error("Error al agregar room:", error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.role?.toUpperCase();

    let url = "events";

    if (role === "HOTEL") {
      url = "events/hotel";
    } else if (role === "ADMIN") {
      url = "events/all";
    }

    const response = await apiClient.get(url);
    return Array.isArray(response.data.events) ? response.data.events : [];
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
};







