import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceForm from "../components/InvoiceForm";
import { getClients } from "../api/clientApi";

const InvoiceFormPage = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await getClients();
        setClients(res.data);
      } catch (error) {
        console.error("Failed to fetch clients", error);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Add New Invoice</h2>
      <InvoiceForm clients={clients} onSuccess={() => navigate("/invoices")} />
    </div>
  );
};

export default InvoiceFormPage;
