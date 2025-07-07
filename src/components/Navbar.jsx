import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed: ", err);
    }
  };
  return (
    <nav className="navbar-bg flex justify-between items-center px-3 py-2">
      <div className="text-2xl font-bold">
        <h1 className="text-white">JobHub</h1>
      </div>
      <div className="flex gap-2">
        <Link to="/">
          <button className="flex items-center gap-2 px-2 py-1 rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-1 border-blue-500">
            <i className="fas fa-laptop-house"></i> Home
          </button>
        </Link>
        {currentUser && (
          <Link to="/">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-1 rounded text-white cursor-pointer home-btn transition hover:bg-blue-600 border-1 border-blue-500"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
