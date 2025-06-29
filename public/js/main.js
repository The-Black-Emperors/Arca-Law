import { checkAuth, handleLogout, getUserName } from './auth.js';
import { initProcessosPage } from './views/Processos.js';
import { initContatosPage } from './views/Contatos.js';
import { initDetalheProcessoPage } from './views/DetalheProcesso.js';

document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const router = new Navigo("/", { hash: false });

    function setActiveLink(path) {
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === path || (path.startsWith('/processo') && linkPath === '/processos')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function handleNavigoLink(event) {
        const anchor = event.target.closest('a[data-navigo]');
        if (anchor) {
            event.preventDefault();
            router.navigate(anchor.getAttribute('href'));
        }
    }

    function startApp() {
        userNameSpan.textContent = getUserName();
        logoutBtn.addEventListener('click', handleLogout);
        
        router
            .on('/processos', () => {
                setActiveLink('/processos');
                initProcessosPage(contentArea, router);
            })
            .on('/contatos', () => {
                setActiveLink('/contatos');
                initContatosPage(contentArea, router);
            })
            .on('/processo/:id', ({ data }) => {
                setActiveLink('/processos');
                initDetalheProcessoPage(contentArea, data.id, router);
            })
            .on('/', () => {
                setActiveLink('/');
                initDashboardPage(contentArea, router);
            })
            .notFound(() => {
                contentArea.innerHTML = '<h2>Página não encontrada</h2>';
            })
            .resolve();
        
        document.querySelector('.sidebar-nav').addEventListener('click', handleNavigoLink);
        contentArea.addEventListener('click', handleNavigoLink);
    }

    try {
        checkAuth();
        startApp();
    } catch(e) {
        console.error(e.message);
    }
});