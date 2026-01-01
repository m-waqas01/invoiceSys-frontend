import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoices } from "../api/invoiceApi";

const statusColors = {
  paid: "bg-green-100 text-green-700",
  partial: "bg-yellow-100 text-yellow-700",
  overdue: "bg-red-100 text-red-700",
  sent: "bg-blue-100 text-blue-700",
  draft: "bg-gray-100 text-gray-700",
};

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await getInvoices(); // Ideally: getInvoiceById(id)
        const inv = res.data.find((i) => i._id === id);
        setInvoice(inv);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading invoice...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Invoice not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/invoices")}
          className="mb-6 text-indigo-600 hover:underline font-medium"
        >
          ← Back to Invoices
        </button>

        {/* Invoice Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Invoice #{invoice.invoiceNumber}
              </h2>
              <p className="text-sm text-gray-500">
                Due Date:{" "}
                {invoice.dueDate
                  ? new Date(invoice.dueDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold w-fit ${
                statusColors[invoice.status] || statusColors.draft
              }`}
            >
              {invoice.status.toUpperCase()}
            </span>
          </div>

          {/* Client & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-1">
                Billed To
              </h4>
              <p className="font-medium text-gray-800">
                {invoice.client?.name}
              </p>
              {invoice.client?.email && (
                <p className="text-sm text-gray-500">{invoice.client.email}</p>
              )}
            </div>

            <div className="md:text-right">
              <h4 className="text-sm font-semibold text-gray-500 mb-1">
                Invoice Total
              </h4>
              <p className="text-3xl font-bold text-indigo-600">
                ${invoice.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Invoice Items
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Tax %</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => {
                    const sub =
                      item.quantity * item.price +
                      item.quantity * item.price * (item.tax / 100);

                    return (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">{item.tax}%</td>
                        <td className="p-3 text-right font-medium">
                          ${sub.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-1">
                Notes
              </h4>
              <p className="text-gray-700">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
