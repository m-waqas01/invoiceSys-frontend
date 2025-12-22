import axios from "./axiosClient";

// Get all payments
export const getPayments = () => {
  return axios.get("/payments");
};

// Get single payment
export const getPayment = (id) => {
  return axios.get(`/payments/${id}`);
};

// Delete payment (admin only)
export const deletePayment = (id) => {
  return axios.delete(`/payments/${id}`);
};

// Add payment to invoice
export const addPayment = (invoiceId, data) =>
  axios.post(`/invoices/${invoiceId}/payments`, data);
