const mockProcesses = [
    { id: 1, numero: '001/2025', autor: 'Cliente A', status: 'Ativo' },
    { id: 2, numero: '002/2025', autor: 'Cliente B', status: 'Arquivado' }
];

const getAllProcesses = (req, res) => {
    try {
        res.status(200).json(mockProcesses);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar processos.', error: error.message });
    }
};

module.exports = {
    getAllProcesses
};