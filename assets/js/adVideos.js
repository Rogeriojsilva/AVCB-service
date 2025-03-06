// adVideos.js - Versão Final Corrigida

const VIDEO_STORAGE_KEY = 'atualizacoes';
const BASE_PATH = window.location.origin;

// Função aprimorada para extrair ID do YouTube
const extractYouTubeId = url => {
    try {
        const urlObj = new URL(url);
        if(urlObj.hostname.includes('youtu.be')) return urlObj.pathname.slice(1);
        if(urlObj.searchParams.has('v')) return urlObj.searchParams.get('v');
        const path = urlObj.pathname.split('/');
        return path[path.length - 1];
    } catch (e) {
        return null;
    }
};

// Sistema de notificação
const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `sv-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Validação completa do formulário
const validateVideoData = (data) => {
    const errors = [];
    
    if(!data.titulo || data.titulo.length < 5 || data.titulo.length > 100) {
        errors.push('Título deve ter entre 5 e 100 caracteres');
    }
    
    if(!data.url || !extractYouTubeId(data.url)) {
        errors.push('URL do YouTube inválida');
    }
    
    if(!data.descricao || data.descricao.length < 20 || data.descricao.length > 300) {
        errors.push('Descrição deve ter entre 20 e 300 caracteres');
    }
    
    return errors;
};

// Gerador de iframe responsivo
const createYouTubeIframe = (videoId) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.className = 'sv-iframe';
    return iframe;
};

// Gerador de cards de vídeo
const createVideoCard = (videoData) => {
    const card = document.createElement('article');
    card.className = 'sv-video-card';
    
    card.innerHTML = `
        <h3 class="sv-video-titulo">${videoData.titulo}</h3>
        <div class="sv-video-player"></div>
        <p class="sv-video-desc">${videoData.descricao}</p>
        <div class="sv-video-meta">
            <span class="sv-video-date">${videoData.data}</span>
        </div>
    `;
    
    card.querySelector('.sv-video-player').appendChild(createYouTubeIframe(videoData.videoId));
    return card;
};

// Carregamento de vídeos
const loadVideos = () => {
    const container = document.getElementById('videoCollection');
    if(!container) return;

    const videos = JSON.parse(localStorage.getItem(VIDEO_STORAGE_KEY)) || [];
    
    container.innerHTML = videos.length > 0 
        ? videos.map(video => createVideoCard(video).outerHTML).join('')
        : `<div class="sv-video-empty">
                <p>Nenhum vídeo cadastrado. Utilize o formulário de atualização para adicionar novos conteúdos.</p>
           </div>`;
};

// Salvamento de vídeos
const saveVideo = (formData) => {
    console.log('Attempting to save video:', formData);
    const errors = validateVideoData(formData);
    if(errors.length > 0) {
        errors.forEach(error => showToast(error, 'error'));
        return false;
    }

    const videos = JSON.parse(localStorage.getItem(VIDEO_STORAGE_KEY)) || [];
    const newVideo = {
        ...formData,
        videoId: extractYouTubeId(formData.url),
        data: new Date().toLocaleDateString('pt-BR')
    };
    
    console.log('Saving video:', newVideo);
    localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify([newVideo, ...videos]));
    showToast('Vídeo cadastrado com sucesso!');
    return true;
};

// Gerenciamento do formulário
const initVideoForm = () => {
    const form = document.getElementById('videoForm');
    if(!form) return;

    form.addEventListener('submit', (e) => {
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

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
    initVideoForm();
    
    // Atualização automática a cada 5 minutos
    setInterval(loadVideos, 300000);
});

// Sincronização entre abas
window.addEventListener('storage', (e) => {
    if(e.key === VIDEO_STORAGE_KEY) loadVideos();
});