import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import loginImage from "../assets/login.png";
import visibleIcon from "../assets/Visible.png";
import closedIcon from "../assets/closed.png";

const Login = () => {
  const [error, setError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post("http://localhost:5000/login", { username, password });
      if (response.status === 200) {
        setError(false);
        console.log("Login bem-sucedido");
        e.target.querySelector("button").classList.add("success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      setError(true);
      console.error("Erro ao fazer login:", error);
      e.target.querySelector("button").classList.add("error");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container">
      <div className="login-form" style={{ flex: 1 }}>
        <p style={{ fontWeight: "bold", fontSize: "1.2em" }}>Seja bem-vindo de volta!</p>
        <h3>User Login</h3>        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nome de usuário</label>
            <input type="text" id="username" name="username" placeholder="Digite seu nome" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha de acesso</label>
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Digite sua senha"
              />
              <img
                src={passwordVisible ? visibleIcon : closedIcon}
                alt="Toggle visibility"
                onClick={togglePasswordVisibility}
                className="password-toggle-icon"
              />
            </div>
          </div>
          <button type="submit">Conecte-se agora</button>
        </form>
        {error && <p style={{ color: "red" }}>Credenciais incorretas. Por favor, verifique-as e tente novamente!</p>}
        <p>
          Não é cadastrado? <a href="/register">Clique aqui!</a> <Link to="/reset-password" className="reset-password-link">Redefinir Senha</Link>
        </p>
      </div>
      <div className="login-image" style={{ flex:2 }}>
        <img src={loginImage} alt="Login" />
      </div>
    </div>
  );
};

export default Login;
