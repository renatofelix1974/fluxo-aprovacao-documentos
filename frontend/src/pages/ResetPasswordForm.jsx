import React, { useState } from "react";
import axios from "axios";

const ResetPasswordForm = () => {
  const [passwordReceived, setPasswordReceived] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/change-password", {
        passwordReceived,
        newPassword,
      });
      setMessage("Senha alterada com sucesso!");
    } catch (error) {
      setMessage("Erro ao alterar a senha.");
    }
  };

  return (
    <div className="reset-form-container">
      <h2>Alterar Senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite a senha recebida"
          value={passwordReceived}
          onChange={(e) => setPasswordReceived(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Digite a nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Repita a nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Alterar Senha</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordForm;
