import axios from "./axiosClient";

export const getClients = () => axios.get("/clients");

export const createClient = (data) => axios.post("/clients", data);

export const updateClient = (id, data) => axios.put(`/clients/${id}`, data);

export const deleteClient = (id) => axios.delete(`/clients/${id}`);
