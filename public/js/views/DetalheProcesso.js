import { api } from '../utils/api.js';
import { showToast } from '../utils/toast.js';

export function initDetalheProcessoPage(container, id) {
    let currentProcess = {};

    function renderLayout() {
        const template = `
            <div class="content-header">
                <a href="/processos" class="back-link" data-navigo>&larr; Voltar para a Lista de Processos</a>
                <h2>Detalhes do Processo</h2>
            </div>
            <div class="content-body" id="detalhe-processo-content">
                <div class="spinner-container"><div class="spinner"></div></div>
            </div>
            <div class="update-section">
                <div class="update-header">
                    <h3>Movimentações</h3>
                    <button id="check-updates-btn" class="btn-primary" disabled>Verificar Novas Movimentações</button>
                </div>
                <div id="updates-list-container"><p>Insira a URL do processo e clique em verificar.</p></div>
            </div>
        `;
        container.innerHTML = template;
    }

    function renderProcessoDetails() {
        const detalheContent = container.querySelector('#detalhe-processo-content');
        detalheContent.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <h3><strong>Número:</strong> ${currentProcess.numero}</h3>
                <p><strong>Autor:</strong> ${currentProcess.autor}</p>
                <p><strong>Status:</strong> ${currentProcess.status}</p>
                <div class="form-group" style="margin-top: 15px;">
                    <label for="process-url">Link para Consulta Pública do Tribunal</label>
                    <input type="url" id="process-url" class="form-control" placeholder="Cole aqui o link do processo no site do tribunal">
                </div>
                <p><small>Última verificação: ${currentProcess.last_check_at ? new Date(currentProcess.last_check_at).toLocaleString('pt-BR') : 'Nunca'}</small></p>
            </div>
        `;
    }
    
    async function fetchAndDisplay() {
        try {
            currentProcess = await api.get(`/processos/${id}`);
            renderProcessoDetails();
            container.querySelector('#check-updates-btn').disabled = false;
        } catch (error) {
            showToast(`Erro ao carregar detalhes: ${error.message}`, 'error');
            container.querySelector('#detalhe-processo-content').innerHTML = `<p style="color:red">Não foi possível carregar os detalhes.</p>`;
        }
    }

    function attachEventListeners() {
        const checkUpdatesBtn = container.querySelector('#check-updates-btn');
        checkUpdatesBtn.addEventListener('click', async () => {
            const processUrlInput = container.querySelector('#process-url');
            if (!processUrlInput.value) {
                showToast('Por favor, insira o link para consulta pública do processo.', 'error');
                return;
            }

            checkUpdatesBtn.disabled = true;
            checkUpdatesBtn.textContent = 'Verificando...';

            try {
                const result = await api.post(`/processos/${id}/check-updates`, { processUrl: processUrlInput.value });
                showToast(result.message || 'Verificação concluída!');
                fetchAndDisplay();
            } catch (error) {
                showToast(error.message || 'Falha na verificação.', 'error');
            } finally {
                checkUpdatesBtn.disabled = false;
                checkUpdatesBtn.textContent = 'Verificar Novas Movimentações';
            }
        });
    }

    renderLayout();
    fetchAndDisplay();
    attachEventListeners();
}