import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./../styles/UploadDocument.css";

const DocumentStatus = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [documentName, setDocumentName] = useState(""); // Novo estado para Nome do Documento
  const [documentDescription, setDocumentDescription] = useState(""); // Novo estado para Descrição do Documento
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleDocumentNameChange = (e) => {
    setDocumentName(e.target.value);
  };

  const handleDocumentDescriptionChange = (e) => {
    setDocumentDescription(e.target.value);
  };

  const handleuploads = (e) => {
    e.preventDefault();
    if (selectedFile && selectedArea && documentName && documentDescription) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("area", selectedArea);
      formData.append("name", documentName);
      formData.append("description", documentDescription);

      fetch(`http://localhost:5000/uploads/${selectedArea}`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Arquivo enviado com sucesso:", data);
          setSelectedFile(null);
          setSelectedArea("");
          setDocumentName("");
          setDocumentDescription("");
          setErrorMessage("");
          document.querySelector('input[type="file"]').value = null;
        })
        .catch((error) => {
          console.error("Erro ao enviar arquivo:", error);
          setErrorMessage(`Erro ao enviar arquivo. Verifique se o servidor está ativo e o endpoint está correto. Detalhes: ${error.message}`);
        });
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard"); // Navegar de volta para o Dashboard
  };

  return (
    <div className="document-status-container">
      <h1>Uploads de Documentos</h1>
      <p>"Selecione a área desejada e anexe o documento."</p>
      <form onSubmit={handleuploads}>
        <select value={selectedArea} onChange={handleAreaChange} required>
          <option value="">Selecione a área</option>
          <option value="Administracao">Administração</option>
          <option value="Aeronautica">Aeronáutica</option>
          <option value="Engenharia">Engenharia</option>
          <option value="RH">Recursos Humanos</option>
          <option value="TI">Tecnologia da Informação</option>
        </select>
        <input
          type="text"
          placeholder="Nome do Documento"
          value={documentName}
          onChange={handleDocumentNameChange}
          required
        />
        <textarea
          placeholder="Descrição do Documento"
          value={documentDescription}
          onChange={handleDocumentDescriptionChange}
          required
        />
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Enviar Documento</button>
      </form>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      <button className="back-button" onClick={handleBackToDashboard}>Voltar para o Dashboard</button>
    </div>
  );
};

export default DocumentStatus;
