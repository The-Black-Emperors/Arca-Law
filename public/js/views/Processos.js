import { api } from '../utils/api.js';
import { showToast } from '../utils/toast.js';

export function initProcessosPage(container, router) {
    const template = `
        <div class="content-header">
            <h2>Meus Processos</h2>
            <p>Aqui você verá a lista de processos cadastrados no sistema.</p>
        </div>
        <div class="form-container">
            <h3>Adicionar Novo Processo</h3>
            <form id="create-process-form">
                <div class="form-group"><label for="numero-input">Número do Processo</label><input type="text" id="numero-input" required></div>
                <div class="form-group"><label for="autor-input">Autor</label><input type="text" id="autor-input" required></div>
                <button type="submit" class="btn-primary">Salvar Processo</button>
            </form>
        </div>
        <div class="content-body">
            <div id="process-list"><div class="spinner-container"><div class="spinner"></div></div></div>
        </div>
    `;
    container.innerHTML = template;

    const processListContainer = container.querySelector('#process-list');
    const createProcessForm = container.querySelector('#create-process-form');

    async function fetchProcesses() {
        processListContainer.innerHTML = '<div class="spinner-container"><div class="spinner"></div></div>';
        try {
            const processes = await api.get('/processos');
            displayProcesses(processes);
        } catch (error) {
            showToast(`Erro ao carregar processos: ${error.message}`, 'error');
            processListContainer.innerHTML = `<p>Não foi possível carregar os processos.</p>`;
        }
    }

    function displayProcesses(processes) {
        if (!processes || processes.length === 0) {
            processListContainer.innerHTML = '<p>Nenhum processo encontrado.</p>';
            return;
        }
        processListContainer.innerHTML = `
            <ul class="space-y-4">
                ${processes.map(process => `
                    <li class="bg-white p-4 rounded-lg shadow process-item" data-id="${process.id}">
                        <div class="process-info" data-numero="${process.numero}" data-autor="${process.autor}" data-status="${process.status}">
                            <a href="/processo/${process.id}" class="process-link" data-navigo>
                                <h3 class="font-bold">${process.numero}</h3>
                                <p>Autor: ${process.autor}</p>
                                <p>Status: ${process.status}</p>
                            </a>
                        </div>
                        <div class="process-actions">
                            <button class="edit-btn" data-id="${process.id}">Editar</button>
                            <button class="delete-btn" data-id="${process.id}">Excluir</button>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    createProcessForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const numero = container.querySelector('#numero-input').value;
        const autor = container.querySelector('#autor-input').value;
        try {
            await api.post('/processos', { numero, autor });
            showToast('Processo criado com sucesso!');
            createProcessForm.reset();
            fetchProcesses();
        } catch (error) {
            showToast(`Erro: ${error.message}`, 'error');
        }
    });

    processListContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const listItem = target.closest('.process-item');
        if (!listItem) return;
        
        const processId = listItem.dataset.id;

        if (target.matches('.delete-btn')) {
            if (confirm('Tem certeza que deseja excluir este processo?')) {
                try {
                    await api.delete(`/processos/${processId}`);
                    showToast('Processo deletado com sucesso!');
                    fetchProcesses();
                } catch (error) {
                    showToast(`Erro: ${error.message}`, 'error');
                }
            }
        }

        if (target.matches('.edit-btn')) {
            const infoDiv = listItem.querySelector('.process-info');
            const { numero, autor, status } = infoDiv.dataset;
            listItem.innerHTML = `
                <form class="edit-form" data-id="${processId}">
                    <div class="edit-form-group"><input type="text" name="numero" value="${numero}" required></div>
                    <div class="edit-form-group"><input type="text" name="autor" value="${autor}" required></div>
                    <div class="edit-form-actions">
                        <button type="submit" class="btn-primary">Salvar</button>
                        <button type="button" class="cancel-btn">Cancelar</button>
                    </div>
                </form>
            `;
        }

        if (target.matches('.cancel-btn')) {
            fetchProcesses();
        }

        if (target.matches('.process-link, .process-link *')) {
            event.preventDefault();
            router.navigate(`/processo/${processId}`);
        }
    });

    processListContainer.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (event.target.matches('.edit-form')) {
            const form = event.target;
            const processId = form.dataset.id;
            const numero = form.querySelector('input[name="numero"]').value;
            const autor = form.querySelector('input[name="autor"]').value;
            try {
                await api.put(`/processos/${processId}`, { numero, autor });
                showToast('Processo atualizado com sucesso!');
                fetchProcesses();
            } catch (error) {
                showToast(`Erro: ${error.message}`, 'error');
            }
        }
    });

    fetchProcesses();
}