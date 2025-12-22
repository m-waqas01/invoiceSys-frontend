import { useEffect, useState } from "react";
import {
  getMonthlySales,
  getOutstandingInvoices,
  getSalesByYear,
} from "../api/reportApi";

const Reports = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [yearlySales, setYearlySales] = useState([]);
  const [outstanding, setOutstanding] = useState([]);

  // ✅ Hooks must always be at top level
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [monthlyRes, yearlyRes, outstandingRes] = await Promise.all([
          getMonthlySales(),
          getSalesByYear(),
          getOutstandingInvoices(),
        ]);

        setMonthlySales(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);
        setYearlySales(Array.isArray(yearlyRes.data) ? yearlyRes.data : []);
        setOutstanding(
          Array.isArray(outstandingRes.data) ? outstandingRes.data : []
        );
      } catch (err) {
        console.error("Reports error:", err);
      }
    };

    fetchReports();
  }, []); // ✅ empty dependency array means runs once

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Reports</h2>

      {/* Monthly Sales */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
        {monthlySales.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <ul className="space-y-2">
            {monthlySales.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>Month {item._id}</span>
                <span className="font-semibold">${item.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Yearly Sales */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Yearly Sales</h3>
        {yearlySales.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          <ul className="space-y-2">
            {yearlySales.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item._id}</span>
                <span className="font-semibold">${item.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Outstanding Invoices */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Outstanding Invoices</h3>
        {outstanding.length === 0 ? (
          <p className="text-gray-500">No outstanding invoices</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Invoice</th>
                <th className="p-2 border">Client</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {outstanding.map((inv) => (
                <tr key={inv._id} className="text-center">
                  <td className="p-2 border">{inv.invoiceNumber}</td>
                  <td className="p-2 border">{inv.client?.name}</td>
                  <td className="p-2 border">${inv.total}</td>
                  <td className="p-2 border capitalize">{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
