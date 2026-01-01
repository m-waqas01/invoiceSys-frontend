import { useEffect, useState, useCallback } from "react";
import {
  getInvoices,
  deleteInvoice,
  exportInvoicePDF,
  sendInvoiceByEmail,
} from "../api/invoiceApi";

import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch invoices from backend
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getInvoices(status);
      setInvoices(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to fetch invoices");
    }
  }, [status]); // only changes when `status` changes

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Delete invoice
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    try {
      await deleteInvoice(id);
      fetchInvoices(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to delete invoice");
    }
  };

  // Send invoice email and refresh status
  const handleSendEmail = async (id) => {
    try {
      await sendInvoiceByEmail(id);
      alert("Invoice sent successfully");
      fetchInvoices(); // refresh list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send invoice");
    }
  };

  // Filter invoices based on search input
  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.client?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Invoices</h2>
          <p className="text-sm text-gray-500">Manage and track all invoices</p>
        </div>

        <button
          onClick={() => navigate("/invoices/new")}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg transition"
        >
          + Create Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-4">
        <input
          placeholder="🔍 Search invoice or client"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full md:w-52 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-indigo-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="text-left">Client</th>
              <th>Status</th>
              <th>Total</th>
              <th>Due Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Loading invoices...
                </td>
              </tr>
            )}

            {!loading && filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}

            {!loading &&
              filteredInvoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{inv.invoiceNumber}</td>
                  <td>{inv.client?.name}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        inv.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : inv.status === "partial"
                          ? "bg-yellow-100 text-yellow-700"
                          : inv.status === "overdue"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="font-semibold text-gray-800">
                    ${inv.total.toFixed(2)}
                  </td>

                  <td>
                    {inv.dueDate
                      ? new Date(inv.dueDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => navigate(`/invoices/${inv._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => exportInvoicePDF(inv._id)}
                      className="text-purple-600 hover:underline"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleSendEmail(inv._id)}
                      className="text-green-600 hover:underline"
                    >
                      Email
                    </button>
                    <button
                      onClick={() => handleDelete(inv._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
