export default function handler(request, response) {
  const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  response.status(200).json({
    message: 'Funciona Disgraça Maldita',
    timestamp: date,
  });
}