const Document = require('../models/documentModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.uploadDocument = async (req, res) => {
  try {
    const { title, comments, area } = req.body;
    const filePath = req.file.path;

    const document = await Document.create({ title, comments, filePath, area });
    // Envio de e-mail
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'checker@example.com',
      subject: 'Novo documento para aprovação',
      text: `Um novo documento foi enviado para aprovação.`,
    });

    res.status(201).json({ message: 'Documento enviado com sucesso!', document });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
