import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../api/authApi";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="
        w-full px-4 py-2.5 rounded-lg
        border border-gray-300
        text-gray-800 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
        transition duration-200
      "
              />
            </div>

            {/* Email */}
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
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
        transition duration-200
      "
              />
            </div>

            {/* Password */}
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
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
        transition duration-200
      "
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="
      w-full py-2.5 rounded-lg
      bg-green-600 text-white font-semibold
      hover:bg-green-700
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
      transition duration-200
    "
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
