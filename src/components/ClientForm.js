import { useState } from "react";
import { createClient } from "../api/clientApi";

const ClientForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createClient(form);
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
      });
      onSuccess && onSuccess();
    } catch (err) {
      alert("Failed to add client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-800">Add Client</h3>

      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Client Name"
        className="input"
        value={form.name}
        onChange={handleChange}
        required
      />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Client Email (optional)"
        className="input"
        value={form.email}
        onChange={handleChange}
      />

      {/* Phone */}
      <input
        type="text"
        name="phone"
        placeholder="Phone (optional)"
        className="input"
        value={form.phone}
        onChange={handleChange}
      />

      {/* Address */}
      <input
        type="text"
        name="address"
        placeholder="Address (optional)"
        className="input"
        value={form.address}
        onChange={handleChange}
      />

      {/* Notes */}
      <textarea
        name="notes"
        placeholder="Notes (optional)"
        className="input min-h-[80px]"
        value={form.notes}
        onChange={handleChange}
      />

      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "Saving..." : "Add Client"}
      </button>
    </form>
  );
};

export default ClientForm;
