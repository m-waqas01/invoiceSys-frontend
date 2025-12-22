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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Clients</h2>
        {editingId && (
          <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
            Editing Mode
          </span>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            name="name"
            className="input"
            placeholder="Client Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            className="input"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="phone"
            className="input"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            name="address"
            className="input"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3 mt-6">
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
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{c.name}</td>
                <td>{c.email || "-"}</td>
                <td>{c.phone || "-"}</td>
                <td className="text-right pr-6 space-x-4">
                  <button
                    onClick={() => editClient(c)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeClient(c._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {clients.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
