import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoices } from "../api/invoiceApi"; // or create getInvoice(id)

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await getInvoices(); // ideally use a getInvoice(id) API
        const inv = res.data.find((i) => i._id === id);
        setInvoice(inv);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoice();
  }, [id]);

  if (!invoice) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/invoices")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Invoices
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Invoice #{invoice.invoiceNumber}
      </h2>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <p>
          <strong>Client:</strong> {invoice.client?.name}
        </p>
        <p>
          <strong>Status:</strong> {invoice.status}
        </p>
        <p>
          <strong>Due Date:</strong>{" "}
          {new Date(invoice.dueDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Total:</strong> ${invoice.total}
        </p>

        <h3 className="font-semibold mt-4">Items:</h3>
        <ul className="list-disc pl-6">
          {invoice.items.map((item, index) => (
            <li key={index}>
              {item.name} — Qty: {item.quantity}, Price: ${item.price}, Tax:{" "}
              {item.tax}%
            </li>
          ))}
        </ul>

        {invoice.notes && (
          <p className="mt-2">
            <strong>Notes:</strong> {invoice.notes}
          </p>
        )}
      </div>
    </div>
  );
};

export default InvoiceView;
