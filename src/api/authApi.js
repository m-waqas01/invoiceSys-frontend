import axiosClient from "./axiosClient";

// Login user
export const login = (data) => axiosClient.post("/auth/login", data);

// Register user
export const signup = (data) => axiosClient.post("/auth/register", data);
