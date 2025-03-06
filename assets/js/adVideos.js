// adVideos.js

// Função para extrair ID do vídeo do YouTube
const extractYouTubeId = url => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Gerar HTML do card de vídeo
const createVideoCard = (video, isLatest = false) => {
    return `
        <li class="video-card" ${isLatest ? 'id="latestVideoUpdate"' : ''}>
            <article class="video-article">
                <a href="#" class="video-link">
                    <div class="video-meta">
                        <time class="video-date">${video.data}</time>
                        <span class="video-comments">${video.comentarios} comentários</span>
                    </div>
                    
                    <div class="video-embed__container">
                        <iframe class="video-embed" 
                            src="https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1" 
                            title="${video.titulo}"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    
                    <div class="video-content">
                        <h3 class="video-heading">${video.titulo}</h3>
                        <p class="video-excerpt">${video.descricao}</p>
                    </div>
                </a>
            </article>
        </li>
    `;
};

// Carregar e exibir vídeos
const loadVideos = () => {
    const videoList = document.getElementById('videoCollection');
    const videos = JSON.parse(localStorage.getItem('atualizacoes')) || [];
    
    if(videos.length === 0) {
        videoList.innerHTML = `
            <li class="video-empty">
                Nenhum vídeo cadastrado. Utilize o formulário de atualização para adicionar novos conteúdos.
            </li>
        `;
        return;
    }

    videoList.innerHTML = videos.map((video, index) => 
        createVideoCard(video, index === 0)
    ).join('');
};

// Função para salvar novo vídeo (usar na página de formulário)
const saveVideo = (videoData) => {
    const videos = JSON.parse(localStorage.getItem('atualizacoes')) || [];
    
    const newVideo = {
        ...videoData,
        videoId: extractYouTubeId(videoData.url),
        data: new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }),
        comentarios: 0
    };

    videos.unshift(newVideo);
    localStorage.setItem('atualizacoes', JSON.stringify(videos));
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Página principal
    if(document.getElementById('videoCollection')) {
        loadVideos();
    }

    // Página de formulário
    if(document.getElementById('videoForm')) {
        document.getElementById('videoForm').addEventListener('submit', e => {
            e.preventDefault();
            
            const formData = {
                titulo: document.getElementById('titulo').value,
                descricao: document.getElementById('descricao').value,
                url: document.getElementById('youtubeUrl').value
            };

            if(!extractYouTubeId(formData.url)) {
                alert('URL do YouTube inválida!');
                return;
            }

            saveVideo(formData);
            window.location.href = '../index.html';
        });
    }
});

// Atualização periódica (opcional)
setInterval(() => {
    if(document.getElementById('videoCollection')) {
        loadVideos();
    }
}, 300000); // Atualiza a cada 5 minutos