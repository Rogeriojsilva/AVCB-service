document.addEventListener("DOMContentLoaded", function() {
    // Função para carregar dados dos Hoots
    function loadHootData() {
        const style = getComputedStyle(document.documentElement);
        
        // Mapeamento de elementos e variáveis
        const elementsMap = {
            'phone-link': {
                var: '--contact-phone-number',
                attr: 'href'
            },
            'whatsapp-link': {
                var: '--contact-whatsapp-number',
                attr: 'href'
            },
            'phone-text': {
                var: '--contact-phone-text',
                attr: 'textContent'
            },
            'whatsapp-text': {
                var: '--contact-whatsapp-text',
                attr: 'textContent'
            }
        };

        // Atualiza todos os elementos
        Object.entries(elementsMap).forEach(([id, config]) => {
            const elements = document.querySelectorAll(`[data-hoot="${id}"]`);
            if(elements && elements.length > 0) {
                const value = style.getPropertyValue(config.var).trim().replace(/"/g, '');
                
                elements.forEach(element => {
                    if(config.attr === 'href' || config.attr === 'src') {
                        element.setAttribute(config.attr, value);
                    } else {
                        element[config.attr] = value;
                    }
                });
            }
        });
    }

    // Inicialização
    loadHootData();

    // Initialize mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
        loadHootData();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Handle HTMX content swaps
    document.addEventListener('htmx:afterSwap', loadHootData);
});