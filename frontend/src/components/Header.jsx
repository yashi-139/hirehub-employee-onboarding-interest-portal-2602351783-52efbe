import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useNavigate } from 'react-router-dom';

/** Returns whether the browser session currently represents an administrator. */
function getAdminAuthentication() {
  return sessionStorage.getItem('hirehub_admin_auth') === 'true';
}

/**
 * Displays persistent site navigation and the session-aware authentication action.
 *
 * @param {{ initialAuthenticated?: boolean }} props - Optional test override for auth state.
 * @returns {JSX.Element} The sticky primary navigation header.
 */
function Header({ initialAuthenticated = undefined }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAuthenticated ?? getAdminAuthentication(),
  );

  useEffect(() => {
    /** Synchronize this persistent header after local administrator session changes. */
    function syncAuthentication() {
      setIsAuthenticated(getAdminAuthentication());
    }

    window.addEventListener('hirehub-admin-auth-change', syncAuthentication);
    return () => window.removeEventListener('hirehub-admin-auth-change', syncAuthentication);
  }, []);

  /** Clears the demo administrator session and returns the visitor to the home route. */
  function handleLogout() {
    sessionStorage.removeItem('hirehub_admin_auth');
    window.dispatchEvent(new Event('hirehub-admin-auth-change'));
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="header-content">
        <Link className="brand" to="/" aria-label="HireHub home">
          HireHub
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/apply">Apply</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
        {isAuthenticated ? (
          <button className="header-auth-action" type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link className="header-auth-action" to="/admin">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  initialAuthenticated: PropTypes.bool,
};


export default Header;
