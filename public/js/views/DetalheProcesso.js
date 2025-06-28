import { api } from '../utils/api.js';
import { showToast } from '../utils/toast.js';

export function initDetalheProcessoPage(container, id) {
    let currentProcess = {};

    function renderLayout() {
        const template = `
            <div class="content-header">
                <a href="/processos" class="back-link" data-navigo>&larr; Voltar para a Lista de Processos</a>
                <h2 id="processo-numero-header">Detalhes do Processo</h2>
            </div>
            <div class="content-body" id="detalhe-processo-content">
                <div class="spinner-container"><div class="spinner"></div></div>
            </div>
            <div class="financial-section">
                <h3>Painel Financeiro do Processo</h3>
                <div id="financial-summary-container" class="financial-summary"></div>
                <form id="financial-entry-form" class="financial-entry-form">
                    <h4>Adicionar Lançamento</h4>
                    <div class="form-group">
                        <label for="entry-description">Descrição</label>
                        <input type="text" id="entry-description" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="entry-value">Valor (R$)</label>
                            <input type="number" step="0.01" id="entry-value" required>
                        </div>
                        <div class="form-group">
                            <label for="entry-type">Tipo</label>
                            <select id="entry-type" required>
                                <option value="RECEITA">Receita</option>
                                <option value="DESPESA">Despesa</option>
                            </select>
                        </div>
                    </div>
                     <div class="form-row">
                        <div class="form-group">
                            <label for="entry-status">Status</label>
                            <select id="entry-status" required>
                                <option value="PAGO">Pago</option>
                                <option value="PENDENTE">Pendente</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="entry-due-date">Data de Vencimento</label>
                            <input type="date" id="entry-due-date">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Adicionar Lançamento</button>
                </form>
                <h4 style="margin-top: 30px;">Histórico de Lançamentos</h4>
                <div id="financial-list-container"></div>
            </div>
        `;
        container.innerHTML = template;
    }

    function renderProcessoDetails() {
        container.querySelector('#processo-numero-header').textContent = `Detalhes do Processo: ${currentProcess.numero}`;
        const detalheContent = container.querySelector('#detalhe-processo-content');
        detalheContent.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <p><strong>Autor:</strong> ${currentProcess.autor}</p>
                <p><strong>Status do Processo:</strong> ${currentProcess.status}</p>
                <p><strong>Criado em:</strong> ${new Date(currentProcess.created_at).toLocaleString('pt-BR')}</p>
            </div>
        `;
    }

    function renderFinancials(entries) {
        const listContainer = container.querySelector('#financial-list-container');
        const summaryContainer = container.querySelector('#financial-summary-container');
        
        let totalReceitas = 0;
        let totalDespesas = 0;

        entries.forEach(entry => {
            if(entry.type === 'RECEITA' && entry.status === 'PAGO') totalReceitas += parseFloat(entry.value);
            if(entry.type === 'DESPESA' && entry.status === 'PAGO') totalDespesas += parseFloat(entry.value);
        });

        const saldo = totalReceitas - totalDespesas;

        summaryContainer.innerHTML = `
            <div class="summary-card"><h4 class="receita">Receitas Pagas</h4><p>R$ ${totalReceitas.toFixed(2)}</p></div>
            <div class="summary-card"><h4 class="despesa">Despesas Pagas</h4><p>R$ ${totalDespesas.toFixed(2)}</p></div>
            <div class="summary-card"><h4 class="saldo">Saldo</h4><p>R$ ${saldo.toFixed(2)}</p></div>
        `;

        if (entries.length === 0) {
            listContainer.innerHTML = '<p>Nenhum lançamento financeiro para este processo.</p>';
            return;
        }
        listContainer.innerHTML = `
            <ul class="financial-entry-list">
                ${entries.map(entry => `
                    <li class="entry-item">
                        <div>
                            <p class="description">${entry.description}</p>
                            <p class="date">Status: ${entry.status} | Vencimento: ${entry.due_date ? new Date(entry.due_date).toLocaleDateString('pt-BR') : 'N/A'}</p>
                        </div>
                        <p class="value ${entry.type === 'RECEITA' ? 'receita' : 'despesa'}">
                            ${entry.type === 'RECEITA' ? '+' : '-'} R$ ${parseFloat(entry.value).toFixed(2)}
                        </p>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    async function fetchAllData() {
        container.querySelector('#detalhe-processo-content').innerHTML = '<div class="spinner-container"><div class="spinner"></div></div>';
        try {
            currentProcess = await api.get(`/processos/${id}`);
            renderProcessoDetails();
            const financialEntries = await api.get(`/financials/process/${id}`);
            renderFinancials(financialEntries);
        } catch (error) {
            showToast(`Erro ao carregar dados: ${error.message}`, 'error');
        }
    }

    function attachEventListeners() {
        const financialForm = container.querySelector('#financial-entry-form');
        financialForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = {
                description: container.querySelector('#entry-description').value,
                value: container.querySelector('#entry-value').value,
                type: container.querySelector('#entry-type').value,
                status: container.querySelector('#entry-status').value,
                due_date: container.querySelector('#entry-due-date').value || null
            };
            try {
                await api.post(`/financials/process/${id}`, formData);
                showToast('Lançamento adicionado com sucesso!');
                financialForm.reset();
                fetchAllData();
            } catch (error) {
                showToast(`Erro ao salvar lançamento: ${error.message}`, 'error');
            }
        });
    }

    renderLayout();
    fetchAllData();
    attachEventListeners();
}