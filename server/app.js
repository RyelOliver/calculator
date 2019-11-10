const express = require('express');
const { calculate } = require('../shared/expression');

const HOST = 'http://localhost';
const PORT = 4000;
const URL = `${HOST}:${PORT}`;

const app = express();

app.get('/calculate', (req, res) => {
    const { expression } = req.query;
    res.send(calculate(expression).toString());
});

app.listen(PORT, () => console.info(`Server running at ${URL}`));