document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu_toggle');
    const menuNivel1 = document.querySelector('.menu_nivel_1');
    const dropdownParents = document.querySelectorAll('.has_dropdown > a');

    // Abrir/Fechar Menu Principal no Mobile
    menuToggle.addEventListener('click', function() {
        menuNivel1.classList.toggle('active');
    });

    // Abrir/Fechar Submenus no Mobile
    dropdownParents.forEach(parent => {
        parent.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                event.preventDefault();
                const submenu = this.nextElementSibling;
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // Hover no Desktop
    if (window.innerWidth > 768) {
        dropdownParents.forEach(parent => {
            parent.addEventListener('mouseenter', function() {
                this.nextElementSibling.style.display = 'block';
            });

            parent.parentElement.addEventListener('mouseleave', function() {
                this.querySelector('.menu_nivel_2, .menu_nivel_3').style.display = 'none';
            });
        });
    }
});

