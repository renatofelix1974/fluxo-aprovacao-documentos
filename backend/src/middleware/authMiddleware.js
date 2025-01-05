exports.isAdmin = (req, res, next) => {
    const userRole = req.user?.role; // Supondo que o `req.user` já tenha sido populado pelo token
    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar.' });
    }
    next();
  };
  