import axiosClient from "./axiosClient";

// Fetch all invoices
export const getInvoices = (status) =>
  axiosClient.get("/invoices", { params: { status } });

// Add a new invoice
export const createInvoice = (data) => axiosClient.post("/invoices", data);

// Update invoice
export const updateInvoice = (id, data) =>
  axiosClient.put(`/invoices/${id}`, data);

// Delete invoice
export const deleteInvoice = async (id) => {
  const res = await axiosClient.delete(`/invoices/${id}`);
  return res.data;
};

// Send invoice via email
export const sendInvoiceByEmail = async (id) => {
  const res = await axiosClient.post(`/invoices/${id}/send`);
  return res.data;
};

// Export invoice PDF
export const exportInvoicePDF = async (id) => {
  const res = await axiosClient.get(`/invoices/${id}/export/pdf`, {
    responseType: "blob",
  });

  // Download the PDF
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
