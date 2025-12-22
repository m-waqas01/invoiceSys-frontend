import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ setSidebarOpen }) => {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg font-medium transition
     ${
       pathname === path
         ? "bg-blue-600 text-white"
         : "text-gray-700 hover:bg-blue-100"
     }`;

  return (
    <aside className="h-full w-64 bg-white p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-8">
        Invoice<span className="text-blue-600">Sys</span>
      </h2>

      <ul className="space-y-2">
        <li>
          <Link
            to="/"
            className={linkClass("/")}
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/clients"
            className={linkClass("/clients")}
            onClick={() => setSidebarOpen(false)}
          >
            Clients
          </Link>
        </li>
        <li>
          <Link
            to="/invoices"
            className={linkClass("/invoices")}
            onClick={() => setSidebarOpen(false)}
          >
            Invoices
          </Link>
        </li>
        <li>
          <Link
            to="/payments"
            className={linkClass("/payments")}
            onClick={() => setSidebarOpen(false)}
          >
            Payments
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className={linkClass("/reports")}
            onClick={() => setSidebarOpen(false)}
          >
            Reports
          </Link>
        </li>
      </ul>

      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} InvoiceSys
      </div>
    </aside>
  );
};

export default Sidebar;
