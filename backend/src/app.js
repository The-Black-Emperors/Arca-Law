require('dotenv').config();
const express = require('express');
const cors = require('cors');
const processRoutes = require('./routes/processRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/processos', processRoutes);

app.get('/', (req, res) => {
    res.send('API do Arca Law está no ar!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});