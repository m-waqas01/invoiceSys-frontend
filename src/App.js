import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import InvoiceFormPage from "./pages/InvoiceFormPage";
import InvoiceView from "./pages/InvoiceView";

function App() {
  const [token, setToken] = useState(null);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route
        path="/signup"
        element={!token ? <Signup /> : <Navigate to="/" replace />}
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          token ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/invoices/new" element={<InvoiceFormPage />} />
                <Route path="/invoices/:id" element={<InvoiceView />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
