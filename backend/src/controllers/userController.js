const { createUser, getAllUsers, resetPassword } = require('../models/userModel');

// Cadastro de usuário
exports.registerUser = async (req, res) => {
  const { fullName, username, password, email, cpf, role } = req.body;

  try {
    const newUser = await createUser(fullName, username, password, email, cpf, role || 'user');
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário', details: error.message });
  }
};

// Listar todos os usuários (apenas para administradores)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
  }
};

// Resetar senha de usuário
exports.resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const updatedUser = await resetPassword(userId, newPassword);
    res.status(200).json({ message: 'Senha resetada com sucesso', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao resetar senha', details: error.message });
  }
};
