import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/authApi";

const Login = ({ setToken }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await login(form);

      // Save data
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // 🔥 Update App state
      setToken(res.data.token);

      setSuccess("Login successful! Redirecting...");

      // 🔥 Navigate instantly
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to manage your invoices
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-600 p-3 rounded mb-4 text-sm text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="
      w-full px-4 py-2.5 rounded-lg
      border border-gray-300
      text-gray-800 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      transition duration-200
    "
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="
      w-full px-4 py-2.5 rounded-lg
      border border-gray-300
      text-gray-800 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      transition duration-200
    "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
