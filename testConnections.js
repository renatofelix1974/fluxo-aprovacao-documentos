const axios = require('axios');
const { Client } = require('pg');

// Testa a conexão do frontend com o backend
async function testFrontendToBackend() {
  try {
    const response = await axios.get('http://localhost:5000/health');
    if (response.status === 200) {
      console.log('Conexão do frontend com o backend bem-sucedida');
    } else {
      console.log('Falha na conexão do frontend com o backend');
    }
  } catch (error) {
    console.error('Erro ao conectar o frontend com o backend:', error);
  }
}

// Testa a conexão do backend com o PostgreSQL
async function testBackendToPostgres() {
  const client = new Client({
    user: 'postgres', // Substitua pelo seu usuário do PostgreSQL
    host: 'localhost',
    database: 'fluxo_aprovacao', // Substitua pelo seu banco de dados
    password: 'postgres', // Substitua pela sua senha
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Conexão do backend com o PostgreSQL bem-sucedida');
    await client.end();
  } catch (error) {
    console.error('Erro ao conectar o backend com o PostgreSQL:', error);
  }
}

// Executa os testes
testFrontendToBackend();
testBackendToPostgres();

// Para executar os testes de conexão, siga os passos abaixo:
// 1. Certifique-se de que o backend está em execução na URL `http://localhost:5000`.
// 2. Certifique-se de que o PostgreSQL está em execução e acessível com as credenciais fornecidas.
// 3. Execute o arquivo `testConnections.js` usando o Node.js.
