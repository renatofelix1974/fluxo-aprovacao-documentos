require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Configuração do banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: console.log, // Adicionar logging para depuração
  }
);

sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Definição dos modelos
const User = sequelize.define("User", {
  fullName: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  resetToken: { type: DataTypes.STRING, allowNull: true },
  resetTokenExpiry: { type: DataTypes.DATE, allowNull: true },
});

// Sincronizar o modelo com o banco de dados para garantir que todas as colunas existam
sequelize.sync({ alter: true })
  .then(() => console.log('Modelos sincronizados com sucesso.'))
  .catch(err => console.error('Erro ao sincronizar modelos:', err));

// Definição dos modelos
const Document = sequelize.define("Document", {
  filename: { type: DataTypes.STRING, allowNull: false },
  area: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pendente" },
});

sequelize.sync();

// Configuração do transporte de e-mails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configuração do armazenamento de arquivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const area = req.params.area || "";
    const folder = path.join(__dirname, "uploads", area);

    await fs.ensureDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Rotas
app.post("/register", async (req, res) => {
  try {
    const { fullName, username, password, email, cpf, role } = req.body;
    console.log("Dados recebidos para registro:", { fullName, username, email, cpf, role }); // Log para depuração
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      username,
      password: hashedPassword,
      email,
      cpf,
      role,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({ message: "Login bem-sucedido" });
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  } catch (error) {
    console.error("Erro ao verificar credenciais:", error);
    res.status(500).json({ error: "Erro ao verificar credenciais" });
  }
});

app.post("/upload/:area", upload.single("file"), async (req, res) => {
  try {
    const { area } = req.params;
    const newDocument = await Document.create({
      filename: req.file.filename,
      area,
    });

    res.status(200).json({ message: "Arquivo enviado com sucesso", document: newDocument });
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
    res.status(500).json({ error: "Erro ao enviar arquivo" });
  }
});

app.get("/documents", async (req, res) => {
  try {
    const { area } = req.query;
    const documents = await Document.findAll({ where: { area } });
    res.status(200).json(documents);
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    res.status(500).json({ error: "Erro ao buscar documentos" });
  }
});

app.post("/documents/:id/sign", async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByPk(id);

    if (document) {
      document.status = "ok";
      await document.save();
      res.status(200).json({ message: "Documento assinado com sucesso" });
    } else {
      res.status(404).json({ error: "Documento não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao assinar documento:", error);
    res.status(500).json({ error: "Erro ao assinar documento" });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email recebido para redefinição de senha:", email); // Log para depuração
    if (!email) {
      return res.status(400).json({ error: "O campo email é obrigatório." });
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      const hashedPassword = await bcrypt.hash("1234", 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Senha redefinida para 1234." });
    } else {
      res.status(404).json({ error: "Usuário não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    res.status(500).json({ error: "Erro ao solicitar redefinição de senha." });
  }
});

app.post("/reset-password/confirm", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ where: { resetToken: token } });

    if (user) {
      if (user.resetTokenExpiry < new Date()) {
        return res.status(400).json({ error: "Token expirado." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      res.status(200).json({ message: "Senha redefinida com sucesso." });
    } else {
      res.status(404).json({ error: "Token inválido ou expirado." });
    }
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({ error: "Erro ao redefinir senha." });
  }
});

app.post("/change-password", async (req, res) => {
  try {
    const { passwordReceived, newPassword } = req.body;
    const user = await User.findOne();

    if (user && await bcrypt.compare(passwordReceived, user.password)) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Senha alterada com sucesso." });
    } else {
      res.status(404).json({ error: "Usuário não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao alterar a senha:", error);
    res.status(500).json({ error: "Erro ao alterar a senha." });
  }
});

// Rota de verificação de saúde
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
