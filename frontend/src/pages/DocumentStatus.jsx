import React, { useState, useEffect } from "react";
import "../styles/DocumentStatus.css";

const DocumentStatus = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    if (selectedArea) {
      fetch(`http://localhost:5000/uploads/${selectedArea}/documents`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => setDocuments(data))
        .catch((error) => console.error("Erro ao buscar documentos:", error));
    }
  }, [selectedArea]);

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
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
    <div className="document-status-container">
      <h1>Status dos testes Documentos</h1>
      <p>Aqui você verá os documentos separados por área.</p>
      <select value={selectedArea} onChange={handleAreaChange} required>
        <option value="">Selecione a área</option>
        <option value="Administração">Administração</option>
        <option value="Aeronautica">Aeronáutica</option>
        <option value="Engenharia">Engenharia</option>
        <option value="RH">Recursos Humanos</option>
        <option value="TI">Tecnologia da Informação</option>
      </select>
      <div className="documents-list">
        {documents.map((doc) => (
          <div key={doc.id} className="document-item">
            <a href={`http://localhost:5000/uploads/${selectedArea}/${doc.filename}`} target="_blank" rel="noopener noreferrer">
              {doc.filename}
            </a>
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
  );
};

export default DocumentStatus;
