const express = require('express');
const { registerUser, getAllUsers, resetPassword } = require('../controllers/userController');
const { isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para registrar usuário
router.post('/register', registerUser);

// Rota para listar todos os usuários (apenas para administradores)
router.get('/', isAdmin, getAllUsers);

// Rota para resetar senha
router.post('/reset-password', isAdmin, resetPassword);

module.exports = router;
