// index.js

const express = require('express');
require('dotenv').config();
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
  res.send('Hello from Express with sdsdsssss!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});