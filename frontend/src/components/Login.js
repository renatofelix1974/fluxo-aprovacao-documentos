import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <label>
          Senha:
          <input type="password" name="password" />
        </label>
        <button type="submit">Entrar</button>
      </form>
      <p>Não é cadastrado? <Link to="/register">Clique aqui!</Link></p>
      <p><Link to="/reset-password" className="reset-password-link">Redefinir Senha</Link></p>
    </div>
  );
}

export default Login;
