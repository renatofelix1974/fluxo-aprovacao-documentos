import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Register.css";

const Register = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage("Cadastro de Usuario efetuado com sucesso!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        formRef.current.reset();
      } else {
        const errorData = await response.json();
        console.error("Erro ao enviar registro:", errorData);
      }
    } catch (error) {
      console.error("Erro ao enviar registro", error);
    }
  };

  const handleClose = () => {
    formRef.current.reset();
  };

  return (
    <div className="window">
      <div className="window-header">
        <h1>Cadastro de Novo Usuário</h1>
        <button
          className="close-button"
          onClick={handleClose}
          style={{ fontSize: "20px", padding: "15px 5px", width: "30px", backgroundColor: "#f47207", color: "#f43607" }}
        >
          X
        </button>
      </div>
      <form ref={formRef} onSubmit={handleRegister}>
        <input
          name="fullName"
          type="text"
          placeholder="Nome completo"
          required
          style={{ width: "400px", borderColor: "blue" }}
        />
        <input
          name="username"
          type="text"
          placeholder="Nome de usuário"
          required
          style={{ width: "400px", borderColor: "blue" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          required
          style={{ width: "400px", borderColor: "blue" }}
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          style={{ width: "400px", borderColor: "blue" }}
        />
        <input
          name="cpf"
          type="text"
          placeholder="CPF"
          required
          style={{ width: "400px", borderColor: "blue" }}
        />
        <input
          name="role"
          type="text"
          placeholder="Função"
          required
          style={{ width: "400px", borderColor: "blue" }}
        />
        <button type="submit">Registrar</button>
      </form>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Register;
