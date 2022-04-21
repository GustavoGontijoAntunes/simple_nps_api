require('dotenv').config();

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

const userRoutes = require('./routes/user.js');
const surveyRoutes = require('./routes/survey.js');
const answerRoutes = require('./routes/answer.js');

app.use(express.json());

app.use('/security', userRoutes);
app.use('/survey', surveyRoutes);
app.use('/answer', answerRoutes);

app.get('/', (req, res) => {
    res.send('Bem-vindo à página inicial do Simple NPS!');
});

app.listen(port, () => {
    console.info(`Servidor rodando em http://localhost:${port}`);
});