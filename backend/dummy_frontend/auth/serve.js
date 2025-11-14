// dummy_frontend/auth/serve.js
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname)); // serve index.html / app.html

app.listen(3000, () => {
  console.log('Frontend running at http://localhost:3000');
});
