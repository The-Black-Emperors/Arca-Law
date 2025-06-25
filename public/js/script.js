document.addEventListener('DOMContentLoaded', function() {
    const financeiroToggle = document.getElementById('financeiro-toggle');
    const submenu = document.querySelector('.has-submenu .submenu');
    const parentLi = financeiroToggle.parentElement;

    // Toggle para o submenu "Financeiro"
    financeiroToggle.addEventListener('click', function(event) {
        event.preventDefault(); // Impede que o link navegue
        parentLi.classList.toggle('open');
        submenu.classList.toggle('open');
    });

    // Lógica para marcar o link ativo (excluindo o dropdown principal)
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    navLinks.forEach(link => {
        // Ignora o link principal do submenu para não remover a classe 'active'
        if (link.id === 'financeiro-toggle') return;

        link.addEventListener('click', function(e) {
            // Remove 'active' e 'active-sub' de todos os links
            navLinks.forEach(item => {
                item.classList.remove('active');
                item.classList.remove('active-sub');
            });
            
            // Adiciona a classe correta ao link clicado
            if (this.closest('.submenu')) {
                // Se for um link de submenu
                this.classList.add('active-sub');
                // Mantém o pai "Financeiro" ativo
                financeiroToggle.classList.add('active');
            } else {
                // Se for um link de menu principal
                this.classList.add('active');
            }

            // Garante que o menu financeiro permaneça aberto se um de seus filhos for clicado
            if (!parentLi.classList.contains('open') && this.closest('.submenu')) {
                 parentLi.classList.add('open');
                 submenu.classList.add('open');
            }
        });
    });
});