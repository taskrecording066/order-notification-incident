const express = require('express');
const { configureRoutes } = require('./app');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
configureRoutes(app);

app.listen(PORT, () => {
  console.log(`Order notification incident API listening on http://localhost:${PORT}`);
});
