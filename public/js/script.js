document.addEventListener('DOMContentLoaded', function() {
    const financeiroToggle = document.getElementById('financeiro-toggle');
    const submenu = document.querySelector('.has-submenu .submenu');
    const parentLi = financeiroToggle.parentElement;

    financeiroToggle.addEventListener('click', function(event) {
        event.preventDefault(); // Impede que o link navegue
        parentLi.classList.toggle('open');
        submenu.classList.toggle('open');
    });

    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    navLinks.forEach(link => {
        if (link.id === 'financeiro-toggle') return;

        link.addEventListener('click', function(e) {
            navLinks.forEach(item => {
                item.classList.remove('active');
                item.classList.remove('active-sub');
            });
            
            if (this.closest('.submenu')) {
                this.classList.add('active-sub');
                financeiroToggle.classList.add('active');
            } else {
                this.classList.add('active');
            }
            
            if (!parentLi.classList.contains('open') && this.closest('.submenu')) {
                 parentLi.classList.add('open');
                 submenu.classList.add('open');
            }
        });
    });
});