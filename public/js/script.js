const API_URL = 'http://localhost:3000/api/processos';
const processListContainer = document.getElementById('process-list');
const createProcessForm = document.getElementById('create-process-form');

async function handleCreateFormSubmit(event) {
    event.preventDefault();

    const numeroInput = document.getElementById('numero-input');
    const autorInput = document.getElementById('autor-input');

    const newProcessData = {
        numero: numeroInput.value,
        autor: autorInput.value,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProcessData),
        });

        if (!response.ok) {
            throw new Error('Falha ao criar processo.');
        }

        numeroInput.value = '';
        autorInput.value = '';

        fetchProcesses();
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        alert('Não foi possível salvar o processo. Verifique o console.');
    }
}

async function fetchProcesses() {
    if (!processListContainer) {
        console.error('Elemento #process-list não foi encontrado na página.');
        return;
    }
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.statusText}`);
        }
        const processes = await response.json();
        displayProcesses(processes);
    } catch (error) {
        console.error('Falha ao buscar processos:', error);
        processListContainer.innerHTML = `<p style="color: red;">Erro ao carregar processos. Verifique o console (F12) e se o backend está rodando.</p>`;
    }
}

function displayProcesses(processes) {
    processListContainer.innerHTML = '';
    if (processes.length === 0) {
        processListContainer.innerHTML = '<p>Nenhum processo encontrado no banco de dados.</p>';
        return;
    }
    const list = document.createElement('ul');
    list.className = 'space-y-4';
    processes.forEach(process => {
        const listItem = document.createElement('li');
        listItem.className = 'bg-white p-4 rounded-lg shadow';
        listItem.innerHTML = `
            <h3 class="font-bold">${process.numero}</h3>
            <p>Autor: ${process.autor}</p>
            <p>Status: ${process.status}</p>
        `;
        list.appendChild(listItem);
    });
    processListContainer.appendChild(list);
}

createProcessForm.addEventListener('submit', handleCreateFormSubmit);
document.addEventListener('DOMContentLoaded', fetchProcesses);