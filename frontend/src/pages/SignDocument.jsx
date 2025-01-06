import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignDocument.css";

const SignDocument = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [showDocuments, setShowDocuments] = useState(false); // Novo estado para controlar a exibição dos documentos
  const navigate = useNavigate();

  useEffect(() => {
    if (showDocuments && selectedArea) {
      fetch(`http://localhost:5000/documents/${selectedArea}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => setDocuments(data))
        .catch((error) => console.error("Erro ao buscar documentos:", error));
    }
  }, [showDocuments, selectedArea]);

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleLoadDocuments = () => {
    setShowDocuments(true); // Atualizar o estado para mostrar os documentos
  };

  const handleSign = (documentId) => {
    fetch(`http://localhost:5000/documents/${documentId}/sign`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setDocuments((prevDocuments) =>
          prevDocuments.map((doc) =>
            doc.id === documentId ? { ...doc, status: "ok" } : doc
          )
        );
      })
      .catch((error) => console.error("Erro ao assinar documento:", error));
  };

  return (
    <div className="sign-document-page">
      <div className="sign-document-container">
        <h1>Assinar Documentos</h1>
        <p>Selecione a área para ver os documentos disponíveis.</p>
        <div className="area-selection">
          <select value={selectedArea} onChange={handleAreaChange} required>
            <option value="">Selecione a área</option>
            <option value="Admin">Administração</option>
            <option value="Aeronautica">Aeronáutica</option>
            <option value="Engenharia">Engenharia</option>
            <option value="RH">Recursos Humanos</option>
            <option value="TI">Tecnologia da Informação</option>
          </select>
          <button onClick={handleLoadDocuments}>OK</button>
        </div>
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          Voltar ao Dashboard
        </button>
      </div>
      {showDocuments && (
        <div className="documents-list-container">
          <div className="documents-list">
            {documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-info">
                  <p><strong>Nome:</strong> {doc.filename}</p>
                  <p><strong>Descrição:</strong> {doc.description}</p>
                </div>
                <div className="status-indicators">
                  {doc.status === "ok" ? (
                    <button className="status-ok">Documento OK!</button>
                  ) : (
                    <button className="status-pending" onClick={() => handleSign(doc.id)}>Assinar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignDocument;
