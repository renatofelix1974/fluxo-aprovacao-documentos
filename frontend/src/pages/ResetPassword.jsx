import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/ResetPassword.css";

const ResetPassword = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/reset-password", { username });
      setMessage("Solicitação de redefinição de senha enviada com sucesso.");
      setTimeout(() => {
        setUsername("");
        navigate("/reset-password-form");
      }, 2000);
    } catch (error) {
      setMessage("Erro ao solicitar redefinição de senha.");
    }
  };

  return (
    <div className="reset-container">
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleResetRequest}>
        <input
          type="text"
          placeholder="Digite seu nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Solicitar Redefinição</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
