const GNEWS_API_KEY = '92221e88091bab959857e1a937a68fc9';
const YOUTUBE_API_KEY = 'AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A';

// Alternar tema claro/escuro
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  // Salvar preferencia localmente
  if(document.body.classList.contains('dark')){
    localStorage.setItem('theme', 'dark');
    document.getElementById('theme-toggle').textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    document.getElementById('theme-toggle').textContent = '🌙';
  }
});

// Aplicar tema salvo
window.addEventListener('load', () => {
  const theme = localStorage.getItem('theme');
  if(theme === 'dark'){
    document.body.classList.add('dark');
    document.getElementById('theme-toggle').textContent = '☀️';
  }
});

function fetchGNews(type, containerId, query = '') {
  // type: 'top-headlines' ou 'search'
  // query: string de busca (ex: "política")
  const container = document.getElementById(containerId);
  if(!container) return;

  let url = '';

  if(type === 'top-headlines'){
    url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&lang=pt&max=6`;
  } else if(type === 'search'){
    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&token=${GNEWS_API_KEY}&lang=pt&max=12`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if(data.articles && data.articles.length){
        container.innerHTML = data.articles.map(article => `
          <article class="news-article">
            <img src="${article.image || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${article.title}" />
            <h3>${article.title}</h3>
            <p>${article.description || ''}</p>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer">Leia mais</a>
          </article>
        `).join('');
      } else {
        container.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
      }
    })
    .catch(err => {
      container.innerHTML = `<p>Erro ao carregar notícias: ${err.message}</p>`;
    });
}

function fetchRSS(rssUrl, containerId) {
  // Como browsers bloqueiam CORS em RSS, vamos usar um proxy público gratuito para teste (exemplo: https://api.rss2json.com/v1/api.json?rss_url=)
  const container = document.getElementById(containerId);
  if(!container) return;

  const proxy = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl);

  fetch(proxy)
    .then(res => res.json())
    .then(data => {
      if(data.items && data.items.length){
        container.innerHTML = data.items.slice(0,6).map(item => `
          <article class="news-article">
            <img src="${item.thumbnail || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <p>${item.description ? item.description.replace(/<[^>]*>?/gm, '').slice(0, 120) + '...' : ''}</p>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer">Leia mais</a>
          </article>
        `).join('');
      } else {
        container.innerHTML = '<p>Nenhuma notícia encontrada no feed RSS.</p>';
      }
    })
    .catch(err => {
      container.innerHTML = `<p>Erro ao carregar feed RSS: ${err.message}</p>`;
    });
}

function fetchYouTubeVideos() {
  const container = document.getElementById('video-container');
  if(!container) return;

  // Pesquisar vídeos no canal ou palavra-chave
  // Exemplo de busca no canal "GloboNews": canalId=UClYlywVYL8pW-9QbQpvyANw (pode mudar)
  // Para simplicidade: pegar os últimos vídeos de palavra-chave 'notícias'
  const channelId = 'UClYlywVYL8pW-9QbQpvyANw';

  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=4`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if(data.items && data.items.length){
        container.innerHTML = data.items.map(item => {
          const videoId = item.id.videoId;
          if(!videoId) return '';
          return `
            <div class="video-item">
              <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
              <p>${item.snippet.title}</p>
            </div>
          `;
        }).join('');
      } else {
        container.innerHTML = '<p>Nenhum vídeo encontrado.</p>';
      }
    })
    .catch(err => {
      container.innerHTML = `<p>Erro ao carregar vídeos: ${err.message}</p>`;
    });
          }
          
