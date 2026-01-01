import { useEffect, useState } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../api/clientApi";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const fetchClients = async () => {
    try {
      const res = await getClients();
      setClients(res.data);
    } catch (err) {
      console.error("Fetch clients error", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      editingId
        ? await updateClient(editingId, form)
        : await createClient(form);

      resetForm();
      fetchClients();
    } catch (err) {
      alert("Client operation failed");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    });
    setEditingId(null);
  };

  const editClient = (client) => {
    setEditingId(client._id);
    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      notes: client.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeClient = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      await deleteClient(id);
      fetchClients();
    } catch {
      alert("Failed to delete client");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <h2 className="text-3xl font-bold text-gray-800">Clients</h2>
        {editingId && (
          <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
            Editing Mode
          </span>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              className="input p-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Client Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              name="email"
              className="input p-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              name="phone"
              className="input p-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <input
              name="address"
              className="input p-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Notes
          </label>
          <textarea
            name="notes"
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-24"
            placeholder="Additional notes (optional)"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${
              editingId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Update Client" : "Add Client"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No clients found
                </td>
              </tr>
            )}

            {clients.map((c) => (
              <tr
                key={c._id}
                className="border-b hover:bg-gray-50 transition align-middle"
              >
                <td className="p-3 font-medium align-middle">{c.name}</td>
                <td className="p-3 align-middle">{c.email || "-"}</td>
                <td className="p-3 align-middle">{c.phone || "-"}</td>
                <td className="p-3 text-right align-middle space-x-3">
                  <button
                    onClick={() => editClient(c)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeClient(c._id)}
                    className="text-red-600 hover:underline font-medium"
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

export default Clients;
