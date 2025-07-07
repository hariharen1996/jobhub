const Navbar = () => {
  return (
    <nav className="navbar-bg flex justify-between items-center px-3 py-2">
      <div className="text-2xl font-bold">
        <h1 className="text-white">JobHub</h1>
      </div>
      <div>
        <button className="flex items-center gap-2 px-2 py-1 rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-1 border-blue-500">
          <i className="fas fa-laptop-house"></i> Home
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
