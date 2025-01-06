import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DocumentStatus.css";

const DocumentStatus = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const navigate = useNavigate();

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleLoadDocuments = () => {
    if (selectedArea) {
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

  const getStatusColor = (status, dueDate) => {
    const currentDate = new Date();
    const expirationDate = new Date(dueDate);
    if (status === "ok") return "green";
    if (status === "pendente") return "orange";
    if (currentDate > expirationDate) return "red";
    return "gray";
  };

  return (
    <div className="document-status-page">
      <div className="document-status-container">
        <h1>Status dos Documentos</h1>
        <p>Aqui você verá os documentos separados por área.</p>
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
      <div className="documents-list-container">
        <div className="documents-list">
          {documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="document-info">
                <p><strong>Nome:</strong> {doc.filename}</p>
                <p><strong>Descrição:</strong> {doc.description}</p>
              </div>
              <div className="status-indicators">
                <div className={`status-dot ${getStatusColor(doc.status, doc.dueDate)}`}></div>
              </div>
              {doc.status === "pendente" && (
                <button onClick={() => handleSign(doc.id)}>Assinar</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentStatus;
