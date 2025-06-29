require('dotenv').config();
const express = require('express');
const cors = require('cors');
const processRoutes = require('./routes/processRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const financialRoutes = require('./routes/financialRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/processos', processRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/financials', financialRoutes);
app.use('/api/events', eventRoutes);

module.exports = app;