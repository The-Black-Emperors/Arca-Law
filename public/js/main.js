import { checkAuth, handleLogout, getUserName } from './auth.js';
import { initProcessosPage } from './views/Processos.js';
import { initContatosPage } from './views/Contatos.js';
import { initDetalheProcessoPage } from './views/DetalheProcesso.js';

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    try {
        checkAuth();
        userNameSpan.textContent = getUserName();
        logoutBtn.addEventListener('click', handleLogout);

        const router = new Navigo("/", { hash: false });
        
        router
            .on('/processos', (match, query) => {
                initProcessosPage(container, router);
            })
            .on('/contatos', () => {
                initContatosPage(container);
            })
            .on('/processo/:id', ({ data }) => {
                initDetalheProcessoPage(container, data.id, router);
            })
            .on('/', () => {
                router.navigate('/processos');
            })
            .notFound(() => {
                container.innerHTML = '<h2>Página não encontrada</h2>';
            })
            .resolve();
        
        document.querySelector('.sidebar-nav').addEventListener('click', (e) => {
            const anchor = e.target.closest('a[data-navigo]');
            if (anchor) {
                e.preventDefault();
                router.navigate(anchor.getAttribute('href'));
            }
        });

    } catch(e) {
        console.log('Redirecting due to auth check fail.');
    }
    
    const container = document.getElementById('content-area');
});