import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded text-sm font-medium transition ${
    isActive ? 'bg-white/20' : 'hover:bg-white/10'
  }`;

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-brand text-white shadow">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-lg font-bold tracking-tight">
          HN Reader
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Stories
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/bookmarks" className={linkClass}>
              Bookmarks
            </NavLink>
          )}
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm opacity-90 px-2">
                Hi, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded text-sm font-medium bg-white text-brand hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-3 py-1.5 rounded text-sm font-medium bg-white text-brand hover:bg-gray-100"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
