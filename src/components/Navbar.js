const Navbar = ({ setSidebarOpen }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold text-gray-700">
          Invoice Management
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-gray-600">{user?.name}</span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
