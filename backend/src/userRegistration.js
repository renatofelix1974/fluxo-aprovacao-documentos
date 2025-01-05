// ...existing code...
function registerUser(userData) {
  // ...existing code...
  sendUserData(userData)
    .then(response => {
      if (response.success) {
        clearScreen();
        alert('Mensagem enviada com sucesso!');
      } else {
        alert('Dados não foram cadastrados devido a um problema com o banco de dados!');
      }
    })
    .catch(error => {
      alert('Dados não foram cadastrados devido a um problema com o banco de dados!');
    });
}

function clearScreen() {
  // Lógica para limpar a tela
  console.clear();
}
// ...existing code...
