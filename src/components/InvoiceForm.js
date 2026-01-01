import { useState } from "react";
import { createInvoice } from "../api/invoiceApi";

const InvoiceForm = ({ clients, onSuccess }) => {
  const [form, setForm] = useState({
    client: "",
    dueDate: "",
    notes: "",
    items: [{ name: "", quantity: 1, price: 0, tax: 0 }],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = value;
    setForm({ ...form, items });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { name: "", quantity: 1, price: 0, tax: 0 }],
    });
  };

  const removeItem = (index) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  const calculateTotal = () =>
    form.items.reduce((sum, item) => {
      const subtotal = item.quantity * item.price;
      const tax = subtotal * (item.tax / 100);
      return sum + subtotal + tax;
    }, 0);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createInvoice(form);
      setForm({
        client: "",
        dueDate: "",
        notes: "",
        items: [{ name: "", quantity: 1, price: 0, tax: 0 }],
      });
      onSuccess && onSuccess();
    } catch {
      alert("Failed to create invoice");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-8"
    >
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">Create Invoice</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to generate a new invoice
        </p>
      </div>

      {/* Client & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Client <span className="text-red-500">*</span>
          </label>
          <select
            name="client"
            value={form.client}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                 transition"
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                 transition"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Optional notes for the client (payment terms, thank you note, etc.)"
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 resize-none
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
               transition"
        />
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Invoice Items</h3>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase">
          <div className="col-span-5">Item</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Tax %</div>
          <div className="col-span-1"></div>
        </div>

        {/* Items */}
        {form.items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border rounded-lg p-3 bg-gray-50"
          >
            <input
              className="input md:col-span-5"
              placeholder="Item description"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              required
            />

            <input
              type="number"
              className="input md:col-span-2 text-center"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", Number(e.target.value))
              }
            />

            <input
              type="number"
              className="input md:col-span-2 text-center"
              value={item.price}
              onChange={(e) =>
                handleItemChange(index, "price", Number(e.target.value))
              }
            />

            <input
              type="number"
              className="input md:col-span-2 text-center"
              value={item.tax}
              onChange={(e) =>
                handleItemChange(index, "tax", Number(e.target.value))
              }
            />

            <div className="md:col-span-1 text-right">
              {form.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="text-indigo-600 font-medium hover:text-indigo-800"
        >
          + Add Item
        </button>
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <div className="bg-gray-100 rounded-lg px-6 py-4 text-right">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-gray-800">
            ${calculateTotal().toFixed(2)}
          </p>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-xl shadow-lg"
      >
        Create Invoice
      </button>
    </form>
  );
};

export default InvoiceForm;
