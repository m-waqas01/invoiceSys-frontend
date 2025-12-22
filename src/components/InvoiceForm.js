import { useState } from "react";
import { createInvoice } from "../api/invoiceApi";

const InvoiceForm = ({ clients, onSuccess }) => {
  const [form, setForm] = useState({
    client: "",
    dueDate: "",
    notes: "",
    items: [
      {
        name: "",
        quantity: 1,
        price: 0,
        tax: 0,
      },
    ],
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

  const calculateTotal = () => {
    return form.items.reduce((sum, item) => {
      const sub = item.quantity * item.price;
      const tax = sub * (item.tax / 100);
      return sum + sub + tax;
    }, 0);
  };

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
    } catch (err) {
      alert("Failed to create invoice");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-5xl mx-auto space-y-6"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Create Invoice</h3>

      {/* Client & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client
          </label>
          <select
            className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md p-2"
            name="client"
            value={form.client}
            onChange={handleChange}
            required
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md p-2"
            value={form.dueDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md h-24 p-2 resize-none"
          value={form.notes}
          onChange={handleChange}
        />
      </div>

      {/* Invoice Items */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Invoice Items
        </h4>

        {/* Item Header */}
        <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-600 px-2 hidden md:grid">
          <div>Item Name</div>
          <div>Qty</div>
          <div>Price</div>
          <div>Tax %</div>
          <div></div>
        </div>

        {/* Items */}
        {form.items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 items-center border-b py-2"
          >
            <input
              placeholder="Item name"
              className="border-gray-300 rounded-md p-2 w-full"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Qty"
              className="border-gray-300 rounded-md p-2 w-full"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", Number(e.target.value))
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="border-gray-300 rounded-md p-2 w-full"
              value={item.price}
              onChange={(e) =>
                handleItemChange(index, "price", Number(e.target.value))
              }
            />
            <input
              type="number"
              placeholder="Tax %"
              className="border-gray-300 rounded-md p-2 w-full"
              value={item.tax}
              onChange={(e) =>
                handleItemChange(index, "tax", Number(e.target.value))
              }
            />
            <div className="flex justify-end">
              {form.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 font-bold hover:text-red-700 transition"
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
          className="text-indigo-600 font-medium hover:text-indigo-800 transition mt-2"
        >
          + Add Item
        </button>
      </div>

      {/* Total */}
      <div className="text-right text-xl font-bold text-gray-800">
        Total: ${calculateTotal().toFixed(2)}
      </div>

      {/* Submit Button */}
      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow"
        type="submit"
      >
        Create Invoice
      </button>
    </form>
  );
};

export default InvoiceForm;
