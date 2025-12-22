import React from "react";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";

const routes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/", element: <Dashboard /> },
  { path: "/clients", element: <Clients /> },
  { path: "/invoices", element: <Invoices /> },
  { path: "/payments", element: <Payments /> },
  { path: "/reports", element: <Reports /> },
];

export default routes;
