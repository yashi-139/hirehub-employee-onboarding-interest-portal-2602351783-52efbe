import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Render the local-only administrator sign-in form.
 *
 * @param {{ onAuthenticated: () => void }} props - Callback invoked after valid credentials are accepted.
 * @returns {JSX.Element} The administrator login card.
 */
function AdminLogin({ onAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /**
   * Validate the fixed local administrator credentials and establish a browser session.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Submitted form event.
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();

    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem('hirehub_admin_auth', 'true');
      window.dispatchEvent(new Event('hirehub-admin-auth-change'));
      setError('');
      onAuthenticated();
      return;
    }

    setError('Invalid credentials. Please try again.');
  }

  return (
    <section className="admin-login-page" aria-labelledby="admin-login-title">
      <div className="admin-login-card">
        <h1 id="admin-login-title">Admin Login</h1>
        <p>Sign in to review candidate submissions.</p>
        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <div className="form-field">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="admin-primary-button" type="submit">Login</button>
        </form>
      </div>
    </section>
  );
}

AdminLogin.propTypes = {
  onAuthenticated: PropTypes.func.isRequired,
};

export default AdminLogin;
