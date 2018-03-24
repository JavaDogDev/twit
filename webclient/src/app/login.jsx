import * as React from 'react';

import './login.scss';

const LoginPage = () => (
  <main className="login-wrapper">
    <h1>Twit</h1>
    <form action="/api/login" method="POST">
      <input type="text" name="username" placeholder="@username" />
      <input type="password" name="password" placeholder="password" />
      <span className="checkbox-button-container">
        <label htmlFor="rememberMe">
          Remember?
          <input type="checkbox" id="rememberMe" name="rememberMe" />
        </label>
        <input type="submit" className="twat-button" value="Log In" />
      </span>
    </form>
  </main>
);

export default LoginPage;
