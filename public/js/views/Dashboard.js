import { api } from '../utils/api.js';

export function initDashboardPage(container) {
    const template = `
        <div class="content-header">
            <h2>Área de Trabalho</h2>
            <p>Um resumo da sua atividade recente.</p>
        </div>
        <div class="dashboard-grid">
            <div class="dashboard-card" id="processos-widget">
                <h3><i class="fa-solid fa-gavel"></i> Processos Recentes</h3>
                <div class="widget-content"><div class="spinner-container"><div class="spinner"></div></div></div>
            </div>
            <div class="dashboard-card" id="financeiro-widget">
                <h3><i class="fa-solid fa-dollar-sign"></i> Resumo Financeiro</h3>
                <div class="widget-content"><div class="spinner-container"><div class="spinner"></div></div></div>
            </div>
            <div class="dashboard-card" id="agenda-widget">
                <h3><i class="fa-solid fa-calendar-days"></i> Próximos Compromissos</h3>
                <div class="widget-content"><p>Funcionalidade em breve...</p></div>
            </div>
        </div>
    `;
    container.innerHTML = template;

    loadProcessosWidget();
    loadFinanceiroWidget();
}

async function loadProcessosWidget() {
    const widgetContent = document.querySelector('#processos-widget .widget-content');
    try {
        const processos = await api.get('/processos?limit=5');
        if (!processos || processos.length === 0) {
            widgetContent.innerHTML = '<ul><li>Nenhum processo recente.</li></ul>';
            return;
        }
        
        widgetContent.innerHTML = `
            <ul>
                ${processos.map(p => `<li><a href="/processo/${p.id}" data-navigo>${p.numero}</a> <span class="value">${p.status}</span></li>`).join('')}
            </ul>
        `;
    } catch (e) {
        widgetContent.innerHTML = '<p>Não foi possível carregar os processos.</p>';
    }
}

async function loadFinanceiroWidget() {
    const widgetContent = document.querySelector('#financeiro-widget .widget-content');
    try {
        const summary = await api.get('/financials/summary');
        const saldo = parseFloat(summary.total_receitas) - parseFloat(summary.total_despesas);
        widgetContent.innerHTML = `
            <ul>
                <li><span>Receitas Pagas</span> <span class="value receita">R$ ${parseFloat(summary.total_receitas).toFixed(2)}</span></li>
                <li><span>Despesas Pagas</span> <span class="value despesa">R$ ${parseFloat(summary.total_despesas).toFixed(2)}</span></li>
                <li><span>A Receber</span> <span class="value">R$ ${parseFloat(summary.a_receber).toFixed(2)}</span></li>
                <li style="border-top: 1px solid var(--border-color); padding-top: 10px; margin-top: 10px; font-weight: 600;"><span>Saldo (PAGO)</span> <span class="value saldo">R$ ${saldo.toFixed(2)}</span></li>
            </ul>
        `;
    } catch (e) {
        widgetContent.innerHTML = '<p>Não foi possível carregar o resumo.</p>';
    }
}