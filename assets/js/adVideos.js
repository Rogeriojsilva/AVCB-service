// adVideos.js - Versão Corrigida e Unificada

// Configuração de caminhos absolutos
const BASE_PATH = window.location.origin;
const VIDEO_STORAGE_KEY = 'atualizacoes';

// Extração melhorada de ID do YouTube
const extractYouTubeId = url => {
    const parsed = new URL(url);
    
    // Verifica URLs encurtadas
    if(parsed.hostname === 'youtu.be') {
        return parsed.pathname.split('/')[1];
    }
    
    // Verifica parâmetros de ID
    const regExp = /(v=|embed\/|v\/|shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[2] : null;
};

// Sistema de notificação
const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `sv-toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Validação de formulário aprimorada
const validateForm = (formData) => {
    const errors = [];
    
    if(formData.titulo.length < 5 || formData.titulo.length > 100) {
        errors.push('Título deve ter entre 5 e 100 caracteres');
    }
    
    if(!extractYouTubeId(formData.url)) {
        errors.push('URL do YouTube inválida');
    }
    
    if(formData.descricao.length < 20 || formData.descricao.length > 300) {
        errors.push('Descrição deve ter entre 20 e 300 caracteres');
    }
    
    return errors;
};

// Geração dinâmica de iframe com lazy loading
const createVideoIframe = (videoId) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`);
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    return iframe;
};

// Atualização do card de vídeo
const createVideoCard = (video, isLatest = false) => {
    const card = document.createElement('article');
    card.className = 'sv-video-card' + (isLatest ? ' latest-video' : '');
    
    card.innerHTML = `
        <h3 class="sv-video-titulo">${video.titulo}</h3>
        <div class="sv-video-player"></div>
        <p class="sv-video-desc">${video.descricao}</p>
        <div class="sv-video-meta">
            <span class="sv-video-date">${video.data}</span>
            ${video.comentarios > 0 ? 
                `<span class="sv-video-comments">
                    <i class="fas fa-comment"></i> ${video.comentarios}
                </span>` : ''}
        </div>
    `;
    
    card.querySelector('.sv-video-player').appendChild(createVideoIframe(video.videoId));
    return card;
};

// Sistema de carregamento de vídeos com cache
const loadVideos = () => {
    const container = document.getElementById('videoCollection');
    if(!container) return;

    const cached = localStorage.getItem(VIDEO_STORAGE_KEY);
    const videos = cached ? JSON.parse(cached) : [];
    
    container.innerHTML = '';
    
    if(videos.length === 0) {
        container.innerHTML = `
            <li class="video-empty">
                Nenhum vídeo cadastrado. Utilize o formulário de atualização para adicionar novos conteúdos.
            </li>
        `;
        return;
    }

    videos.forEach((video, index) => {
        container.appendChild(createVideoCard(video, index === 0));
    });
};

// Sistema de salvamento com validação
const saveVideo = (formData) => {
    const errors = validateForm(formData);
    if(errors.length > 0) {
        errors.forEach(error => showToast(error, 'error'));
        return false;
    }

    const videos = JSON.parse(localStorage.getItem(VIDEO_STORAGE_KEY)) || [];
    
    const newVideo = {
        ...formData,
        videoId: extractYouTubeId(formData.url),
        data: new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }),
        comentarios: 0
    };

    videos.unshift(newVideo);
    localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(videos));
    showToast('Vídeo cadastrado com sucesso!');
    return true;
};

// Inicialização do formulário
const initForm = () => {
    const form = document.getElementById('videoForm');
    if(!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            titulo: form.titulo.value.trim(),
            descricao: form.descricao.value.trim(),
            url: form.youtubeUrl.value.trim()
        };

        if(saveVideo(formData)) {
            window.location.href = `${BASE_PATH}/index.html`;
        }
    });
};

// Sistema de sincronização entre abas
const syncStorage = () => {
    window.addEventListener('storage', (e) => {
        if(e.key === VIDEO_STORAGE_KEY) {
            loadVideos();
        }
    });
};

// Inicialização geral
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
    initForm();
    syncStorage();
});

// Recarregar vídeos a cada 5 minutos
setInterval(loadVideos, 300000);