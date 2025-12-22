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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <button
          onClick={() => navigate("/invoices/new")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          + New Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-4 items-center">
        <input
          placeholder="Search invoice / client"
          className="input flex-1 border-gray-300 rounded-md p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input w-48 border-gray-300 rounded-md p-2"
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
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Invoice #</th>
              <th className="text-left">Client</th>
              <th>Status</th>
              <th>Total</th>
              <th>Due Date</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Loading...
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
                <tr key={inv._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{inv.invoiceNumber}</td>
                  <td>{inv.client?.name}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        inv.status === "paid"
                          ? "bg-green-100 text-green-600"
                          : inv.status === "partial"
                          ? "bg-yellow-100 text-yellow-600"
                          : inv.status === "overdue"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td>${inv.total.toFixed(2)}</td>
                  <td>
                    {inv.dueDate
                      ? new Date(inv.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3 text-right flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => navigate(`/invoices/${inv._id}`)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => exportInvoicePDF(inv._id)}
                      className="text-purple-600 text-sm"
                    >
                      PDF
                    </button>

                    <button
                      onClick={() => handleSendEmail(inv._id)}
                      className="text-green-600 text-sm"
                    >
                      Email
                    </button>

                    <button
                      onClick={() => handleDelete(inv._id)}
                      className="text-red-500 text-sm"
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
