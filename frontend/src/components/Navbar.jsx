import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#6a11cb", color: "white" }}>
      <Link to="/upload" style={{ margin: "0 15px", color: "white", textDecoration: "none" }}>Anexar Documento</Link>
      <Link to="/status" style={{ margin: "0 15px", color: "white", textDecoration: "none" }}>Status do Documentos</Link>
      <Link to="/Asing" style={{ margin: "0 15px", color: "white", textDecoration: "none" }}>Assinar Documento</Link>
      <Link to="/" style={{ margin: "0 15px", color: "white", textDecoration: "none" }}>Sair</Link>
    </nav>
  );
};

export default Navbar;
