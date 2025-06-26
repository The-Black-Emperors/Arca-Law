const db = require('../database/db');

const getAllProcesses = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT id, numero, autor, status FROM processos ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar processos.', error: error.message });
    }
};

const createProcess = async (req, res) => {
    const { numero, autor } = req.body;

    if (!numero || !autor) {
        return res.status(400).json({ message: 'Número do processo e autor são obrigatórios.' });
    }

    try {
        const queryText = 'INSERT INTO processos(numero, autor) VALUES($1, $2) RETURNING *';
        const { rows } = await db.query(queryText, [numero, autor]);
        res.status(201).json(rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Já existe um processo com este número.' });
        }
        res.status(500).json({ message: 'Erro ao criar processo.', error: error.message });
    }
};

module.exports = {
    getAllProcesses,
    createProcess
};