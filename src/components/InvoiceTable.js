import { markInvoicePaid } from "../api/paymentApi";

const InvoiceTable = ({ invoices, onUpdate }) => {
  const payInvoice = async (id) => {
    try {
      await markInvoicePaid(id);
      onUpdate && onUpdate();
    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="table-th">Client</th>
            <th className="table-th">Amount</th>
            <th className="table-th">Due Date</th>
            <th className="table-th">Status</th>
            <th className="table-th">Action</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id} className="border-t">
              <td className="table-td">{inv.client?.name}</td>
              <td className="table-td">${inv.amount}</td>
              <td className="table-td">
                {new Date(inv.dueDate).toLocaleDateString()}
              </td>
              <td className="table-td">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    inv.status === "paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {inv.status}
                </span>
              </td>
              <td className="table-td">
                {inv.status !== "paid" && (
                  <button
                    onClick={() => payInvoice(inv._id)}
                    className="btn-primary text-sm"
                  >
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
