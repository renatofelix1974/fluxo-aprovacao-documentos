import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./../styles/Dashboard.css";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (selectedArea) {
      fetch(`http://localhost:5000/documents?area=${selectedArea}`)
        .then((response) => response.json())
        .then((data) => setDocuments(data))
        .catch((error) => console.error("Erro ao buscar documentos:", error));
    }
  }, [selectedArea]);

  useEffect(() => {
    fetch("https://api.hgbrasil.com/weather?woeid=455912&format=json-cors")
      .then((response) => response.json())
      .then((data) => setWeather(data.results))
      .catch((error) => console.error("Erro ao buscar dados do tempo:", error));
  }, []);

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

  const getWeatherImage = (condition) => {
    switch (condition) {
      case "clear_day":
        return "soldia.png";
      case "clear_night":
        return "noite.png";
      case "cloud":
        return "nublado.png";
      case "rain":
        return "chuvoso.png";
      default:
        return "default.png";
    }
  };

  return (
    <>
      <Navbar />
      <h1>Bem-vindo ao Dashboard</h1>
      <div className="dashboard-container">
        {weather && (
          <div className="weather-info">
            <p>{new Date().toLocaleString()}</p>
            <h2>Tempo em {weather.city_name}</h2>
            <p>Temperatura: {weather.temp}°C</p>
            <p>Condição: {weather.description}</p>
            <img
              src={`/assets/${getWeatherImage(weather.condition_slug)}`}
              alt={weather.description}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
