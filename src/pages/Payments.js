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

  //  Fetch Payments
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

  //  Fetch Invoices
  const fetchInvoices = async () => {
    const res = await getInvoices();
    setInvoices(res.data);
  };

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, []);

  //  Handle Invoice Selection
  const handleInvoiceChange = (e) => {
    const invoiceId = e.target.value;
    setForm({ ...form, invoiceId, amount: "" });

    const invoice = invoices.find((i) => i._id === invoiceId);
    setRemaining(invoice ? invoice.remainingAmount : 0);
  };

  //  Handle Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount" && Number(value) > remaining) return;

    setForm({ ...form, [name]: value });
  };

  //  ADD PAYMENT
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

      setForm({
        invoiceId: "",
        amount: "",
        method: "cash",
        paidAt: "",
      });

      setRemaining(0);
      fetchPayments();
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  //  Delete Payment
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;
    await deletePayment(id);
    setPayments((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Payments</h2>

      {/*  Add Payment */}
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <select
          name="invoiceId"
          className="input"
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
          className="input"
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
          className="input"
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
          className="input"
          value={form.paidAt}
          onChange={handleChange}
        />

        <div className="col-span-full flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Remaining Balance:{" "}
            <span className="font-semibold text-gray-900">${remaining}</span>
          </p>

          <button
            className="btn-primary"
            disabled={!form.invoiceId || !form.amount}
          >
            Add Payment
          </button>
        </div>
      </form>

      {/* 💳 Payments Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th className="text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center">
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
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">
                  {p.invoice?.invoiceNumber || "N/A"}
                </td>
                <td>${p.amount}</td>
                <td className="capitalize">{p.method}</td>
                <td>
                  {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}
                </td>
                <td className="text-right pr-6">
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
