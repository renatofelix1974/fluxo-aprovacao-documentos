const express = require('express');
const pool = require('./config/db');
const exampleRoutes = require('./routes/exampleRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/example', exampleRoutes);

// Endpoint de saúde
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});