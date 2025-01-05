require('dotenv').config();

const dbURI = process.env.MONGODB_URI || `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

module.exports = {
  dbURI
};