import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { GridIcon, PlusIcon, SunIcon, MoonIcon, LogoutIcon } from "../icons";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthRoute = authRoutes.some((p) => location.pathname.startsWith(p));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "";

  if (isAuthRoute) return null;

  return (
    <nav className="pmp-navbar">
      <div className="pmp-navbar-inner">
        <Link to={user ? "/dashboard" : "/login"} className="pmp-navbar-brand">
          <span className="pmp-logo-mark">PM</span>
          <span className="pmp-navbar-brand-word">Project Management Portal</span>
        </Link>

        {user && (
          <div className="pmp-navbar-right">
            <div className="pmp-navbar-links">
              <Link to="/dashboard" className={`pmp-nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
                <GridIcon /> <span>Dashboard</span>
              </Link>
              <Link to="/add-task" className={`pmp-nav-link ${location.pathname === "/add-task" ? "active" : ""}`}>
                <PlusIcon /> <span>Add Task</span>
              </Link>
            </div>

            <button className="pmp-icon-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle dark mode">
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            <div className="pmp-navbar-divider" />

            <div className="pmp-user-chip">
              <span className="pmp-avatar">{initials}</span>
              <span className="pmp-user-name">{user.name}</span>
            </div>

            <button className="pmp-icon-btn pmp-logout-btn" onClick={handleLogout} title="Logout" aria-label="Logout">
              <LogoutIcon />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;