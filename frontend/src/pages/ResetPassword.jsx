import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/ResetPassword.css";
import logo from "./../assets/logo.png";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/reset-password", { email });
      setMessage("Solicitação de redefinição de senha enviada com sucesso.");
      setTimeout(() => {
        setEmail("");
        navigate("/change-password", { state: { passwordReceived: "1234" } });
      }, 2000);
    } catch (error) {
      setMessage("Erro ao solicitar redefinição de senha.");
    }
  };

  return (
    <div className="reset-container">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleResetRequest}>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Solicitar Redefinição</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
