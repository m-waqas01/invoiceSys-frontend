import { useEffect, useState } from "react";
import { getPayments, deletePayment, addPayment } from "../api/paymentApi";
import { getInvoices } from "../api/invoiceApi";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remaining, setRemaining] = useState(0);

  const [form, setForm] = useState({
    invoiceId: "",
    amount: "",
    method: "cash",
    paidAt: "",
  });

  const fetchPayments = async () => {
    try {
      const res = await getPayments();
      setPayments(res.data);
    } catch {
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    const res = await getInvoices();
    setInvoices(res.data);
  };

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, []);

  const handleInvoiceChange = (e) => {
    const invoiceId = e.target.value;
    setForm({ ...form, invoiceId, amount: "" });

    const invoice = invoices.find((i) => i._id === invoiceId);
    setRemaining(invoice ? invoice.remainingAmount : 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && Number(value) > remaining) return;
    setForm({ ...form, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (Number(form.amount) > remaining) {
      alert("Payment exceeds remaining balance");
      return;
    }

    try {
      await addPayment(form.invoiceId, {
        amount: Number(form.amount),
        method: form.method,
        paidAt: form.paidAt,
      });

      setForm({ invoiceId: "", amount: "", method: "cash", paidAt: "" });
      setRemaining(0);
      fetchPayments();
      fetchInvoices();
    } catch {
      alert("Payment failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;
    await deletePayment(id);
    setPayments((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Payments</h2>

      {/* Add Payment Form */}
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <select
          name="invoiceId"
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={form.invoiceId}
          onChange={handleInvoiceChange}
          required
        >
          <option value="">Select Invoice</option>
          {invoices.map((inv) => (
            <option key={inv._id} value={inv._id}>
              {inv.invoiceNumber} — ${inv.totalAmount}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="amount"
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={`Max: ${remaining}`}
          value={form.amount}
          onChange={handleChange}
          max={remaining}
          min="1"
          disabled={!form.invoiceId}
          required
        />

        <select
          name="method"
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={form.method}
          onChange={handleChange}
        >
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
          <option value="card">Card</option>
        </select>

        <input
          type="date"
          name="paidAt"
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={form.paidAt}
          onChange={handleChange}
        />

        <div className="col-span-full flex justify-between items-center mt-2">
          <p className="text-sm text-gray-600">
            Remaining Balance:{" "}
            <span className="font-semibold text-gray-900">${remaining}</span>
          </p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition disabled:opacity-50"
            disabled={!form.invoiceId || !form.amount}
          >
            Add Payment
          </button>
        </div>
      </form>

      {/* Payments Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-max table-auto">
          <thead className="bg-gray-100 uppercase text-gray-700">
            <tr>
              <th className="p-3 text-left">Invoice</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && payments.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            )}

            {payments.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-medium align-middle">
                  {p.invoice?.invoiceNumber || "N/A"}
                </td>
                <td className="p-3 align-middle">${p.amount}</td>
                <td className="p-3 capitalize align-middle">{p.method}</td>
                <td className="p-3 align-middle">
                  {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}
                </td>
                <td className="p-3 text-right align-middle">
                  <button
                    onClick={() => handleDelete(p._id)}
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

export default Payments;
