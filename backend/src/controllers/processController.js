const db = require('../database/db');

const getAllProcesses = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM processos WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro do Servidor.', error_details: error.toString() });
    }
};

const getProcessById = async (req, res) => {
    const { id } = req.params;
    try {
        const queryText = 'SELECT * FROM processos WHERE id = $1 AND user_id = $2';
        const { rows } = await db.query(queryText, [id, req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Processo não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro do Servidor.' });
    }
};

const createProcess = async (req, res) => {
    const { numero, autor } = req.body;
    if (!numero || !autor) {
        return res.status(400).json({ message: 'Campos obrigatórios.' });
    }
    try {
        const queryText = 'INSERT INTO processos(numero, autor, user_id) VALUES($1, $2, $3) RETURNING *';
        const { rows } = await db.query(queryText, [numero, autor, req.user.id]);
        res.status(201).json(rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Já existe um processo com este número.' });
        }
        res.status(500).json({ message: 'Erro do Servidor.', error_details: error.toString() });
    }
};

const deleteProcess = async (req, res) => {
    const { id } = req.params;
    try {
        const queryText = 'DELETE FROM processos WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await db.query(queryText, [id, req.user.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Processo não encontrado ou não pertence a você.' });
        }
        res.status(200).json({ message: 'Processo deletado.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro do Servidor.', error_details: error.toString() });
    }
};

const updateProcess = async (req, res) => {
    const { id } = req.params;
    const { numero, autor } = req.body;
    if (!numero || !autor) {
        return res.status(400).json({ message: 'Campos obrigatórios.' });
    }
    try {
        const queryText = 'UPDATE processos SET numero = $1, autor = $2 WHERE id = $3 AND user_id = $4 RETURNING *';
        const { rows } = await db.query(queryText, [numero, autor, id, req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Processo não encontrado ou não pertence a você.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Já existe um processo com este novo número.' });
        }
        res.status(500).json({ message: 'Erro do Servidor.', error_details: error.toString() });
    }
};

module.exports = {
    getAllProcesses,
    getProcessById,
    createProcess,
    deleteProcess,
    updateProcess
};