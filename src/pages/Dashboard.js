import { useEffect, useState } from "react";
import { getDashboardReports } from "../api/reportApi";

const Dashboard = () => {
  const [reports, setReports] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalPayments: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getDashboardReports(); // ✅ FIXED
        setReports(res.data);
      } catch (err) {
        console.error("Dashboard report error:", err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className=" p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Welcome back,{" "}
          <span className="font-semibold text-gray-800">{user?.name}</span>
        </p>
      </div>

      {/* Reports Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Clients */}
        <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm uppercase">Total Clients</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {reports.totalClients}
          </p>
        </div>

        {/* Total Invoices */}
        <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-green-500 hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm uppercase">Total Invoices</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {reports.totalInvoices}
          </p>
        </div>

        {/* Total Payments */}
        <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm uppercase">Total Payments</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            ${reports.totalPayments}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
