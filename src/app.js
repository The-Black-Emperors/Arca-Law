require('dotenv').config();
const express = require('express');
const cors = require('cors');
const processRoutes = require('./routes/processRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const financialRoutes = require('./routes/financialRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/processos', processRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/financials', financialRoutes);

app.get('/', (req, res) => {
    res.send('API do Arca Law está no ar!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});