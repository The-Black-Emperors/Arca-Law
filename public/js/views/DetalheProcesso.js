import { api } from '../utils/api.js';
import { showToast } from '../utils/toast.js';

export function initDetalheProcessoPage(container, id, router) {
    const template = `
        <div class="content-header">
            <a href="/processos" class="back-link" data-navigo>&larr; Voltar para a Lista de Processos</a>
            <h2>Detalhes do Processo</h2>
        </div>
        <div class="content-body" id="detalhe-processo-content">
            <div class="spinner-container"><div class="spinner"></div></div>
        </div>
    `;
    container.innerHTML = template;

    const detalheContent = container.querySelector('#detalhe-processo-content');

    async function fetchProcesso() {
        try {
            const processo = await api.get(`/processos/${id}`);
            displayProcesso(processo);
        } catch (error) {
            showToast(`Erro ao carregar detalhes: ${error.message}`, 'error');
            detalheContent.innerHTML = `<p style="color:red">Não foi possível carregar os detalhes do processo.</p>`;
        }
    }

    function displayProcesso(processo) {
        detalheContent.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <h3><strong>Número:</strong> ${processo.numero}</h3>
                <p><strong>Autor:</strong> ${processo.autor}</p>
                <p><strong>Status:</strong> ${processo.status}</p>
                <p><strong>Descrição:</strong> ${processo.descricao || 'Nenhuma descrição informada.'}</p>
                <p><strong>Criado em:</strong> ${new Date(processo.created_at).toLocaleString('pt-BR')}</p>
            </div>
        `;
    }

    fetchProcesso();
}