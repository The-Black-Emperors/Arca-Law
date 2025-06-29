import { api } from '../utils/api.js';

export function initDashboardPage(container) {
    const template = `
        <div class="content-header">
            <h2>Área de Trabalho</h2>
            <p>Um resumo da sua atividade recente.</p>
        </div>
        <div class="dashboard-grid">
            <div class="dashboard-card" id="processos-widget"><h3>Processos Recentes</h3><div class="spinner-container"><div class="spinner"></div></div></div>
            <div class="dashboard-card" id="financeiro-widget"><h3>Resumo Financeiro</h3><div class="spinner-container"><div class="spinner"></div></div></div>
            <div class="dashboard-card" id="agenda-widget"><h3>Próximos Compromissos</h3><p>Em breve...</p></div>
        </div>
    `;
    container.innerHTML = template;

    loadProcessosWidget();
    loadFinanceiroWidget();
}

async function loadProcessosWidget() {
    const widget = document.getElementById('processos-widget');
    try {
        const processos = await api.get('/processos?limit=5');
        let content = '<ul>';
        if (processos.length > 0) {
            processos.forEach(p => {
                content += `<li><span>${p.numero}</span> <span class="value">${p.status}</span></li>`;
            });
        } else {
            content += '<li>Nenhum processo recente.</li>';
        }
        content += '</ul>';
        widget.innerHTML += content;
    } catch (e) {
        widget.innerHTML += '<p>Não foi possível carregar os processos.</p>';
    }
}

async function loadFinanceiroWidget() {
    const widget = document.getElementById('financeiro-widget');
    try {
        const summary = await api.get('/financials/summary');
        const saldo = parseFloat(summary.total_receitas) - parseFloat(summary.total_despesas);
        widget.innerHTML += `
            <ul>
                <li><span>Receitas Pagas</span> <span class="value receita">R$ ${parseFloat(summary.total_receitas).toFixed(2)}</span></li>
                <li><span>Despesas Pagas</span> <span class="value despesa">R$ ${parseFloat(summary.total_despesas).toFixed(2)}</span></li>
                <li><span>A Receber</span> <span class="value">R$ ${parseFloat(summary.a_receber).toFixed(2)}</span></li>
                <li style="border-top: 1px solid #ccc; font-weight: bold;"><span>Saldo (PAGO)</span> <span class="value saldo">R$ ${saldo.toFixed(2)}</span></li>
            </ul>
        `;
    } catch (e) {
        widget.innerHTML += '<p>Não foi possível carregar o resumo financeiro.</p>';
    }
}