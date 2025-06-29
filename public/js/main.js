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
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
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
                initContatosPage(contentArea);
            })
            .on('/processo/:id', ({ data }) => {
                setActiveLink('/processos');
                initDetalheProcessoPage(contentArea, data.id, router);
            })
            .on('/', () => {
                setActiveLink('/processos');
                initProcessosPage(contentArea, router);
            })
            .notFound(() => {
                contentArea.innerHTML = '<h2>Página não encontrada</h2><p>Por favor, use o menu lateral para navegar.</p>';
            })
            .resolve();
        
        document.querySelector('.sidebar-nav').addEventListener('click', (e) => {
            const anchor = e.target.closest('a[data-navigo]');
            if (anchor) {
                e.preventDefault();
                router.navigate(anchor.getAttribute('href'));
            }
        });
    }

    try {
        checkAuth();
        startApp();
    } catch(e) {
        console.error(e.message);
    }
});