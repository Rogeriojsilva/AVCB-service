document.addEventListener("DOMContentLoaded", function() {
    // Função para carregar dados dos Hoots
    function loadHootData() {
        const style = getComputedStyle(document.documentElement);
        
        // Mapeamento de elementos e variáveis
        const elementsMap = {
            'phone-link': '--contact-phone-number',
            'whatsapp-link': '--contact-whatsapp-number',
            'phone-text': '--contact-phone-text',
            'whatsapp-text': '--contact-whatsapp-text'
        };

        // Atualiza todos os elementos
        Object.entries(elementsMap).forEach(([id, variable]) => {
            const element = document.getElementById(id);
            if(element) {
                const value = style.getPropertyValue(variable).replace(/"/g, '');
                
                if(element.tagName === 'A') {
                    element.href = value;
                } else {
                    element.textContent = value;
                }
            }
        });
    }

    // Inicialização
    loadHootData();
});

const elementsMap = {
    'phone-link': '--contact-phone-number',    // ID do link do telefone
    'whatsapp-link': '--contact-whatsapp-number', // ID do link do WhatsApp
    'phone-text': '--contact-phone-text',      // ID do texto do telefone
    'whatsapp-text': '--contact-whatsapp-text' // ID do texto do WhatsApp
};