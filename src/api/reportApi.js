import axiosClient from "./axiosClient";

export const getDashboardReports = () => axiosClient.get("/reports/dashboard");

export const getMonthlySales = () => axiosClient.get("/reports/monthly-sales");

export const getOutstandingInvoices = () =>
  axiosClient.get("/reports/outstanding");

export const getSalesByYear = () => axiosClient.get("/reports/sales-by-year");
