const API_KEYS = {
  newsapi: '92221e88091bab959857e1a937a68fc9',
  youtube: 'AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A',
  gnews: '92221e88091bab959857e1a937a68fc9',
  google: '871681144917-dptlmqik7kl1ulpnkrrgngk9q1dppa3b.apps.googleusercontent.com'
};

// Mapeia categorias para palavras-chave em APIs e RSS feeds
const categoryMap = {
  home: {
    newsapi: 'general',
    gnews: 'general',
    youtube: 'news',
    rss: [
      'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
      'https://feeds.bbci.co.uk/news/rss.xml'
    ]
  },
  politica: {
    newsapi: 'politics',
    gnews: 'politics',
    youtube: 'politics',
    rss: [
      'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
      'https://feeds.bbci.co.uk/news/politics/rss.xml'
    ]
  },
  esportes: {
    newsapi: 'sports',
    gnews: 'sports',
    youtube: 'sports',
    rss: [
      'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml',
      'https://feeds.bbci.co.uk/sport/rss.xml?edition=uk'
    ]
  },
  tecnologia: {
    newsapi: 'technology',
    gnews: 'technology',
    youtube: 'technology',
    rss: [
      'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
      'https://feeds.bbci.co.uk/news/technology/rss.xml'
    ]
  },
  entretenimento: {
    newsapi: 'entertainment',
    gnews: 'entertainment',
    youtube: 'entertainment',
    rss: [
      'https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml',
      'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'
    ]
  }
};

const proxyUrl = 'https://api.allorigins.win/get?url='; // Proxy para evitar CORS

// Detecta categoria da página pelo nome do arquivo
function detectCategory() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('politica')) return 'politica';
  if (path.includes('esportes')) return 'esportes';
  if (path.includes('tecnologia')) return 'tecnologia';
  if (path.includes('entretenimento')) return 'entretenimento';
  return 'home'; // padrão home
}

// Renderiza lista de notícias no container #news-container
function renderNews(articles) {
  const container = document.getElementById('news-container');
  if (!container) return;

  if (!articles.length) {
    container.innerHTML = '<p>Sem notícias disponíveis no momento.</p>';
    return;
  }

  container.innerHTML = ''; // limpa

  articles.forEach(article => {
    const div = document.createElement('div');
    div.className = 'news-item';

    const img = article.urlToImage || article.image || '';
    div.innerHTML = `
      <a href="${article.url}" target="_blank" rel="noopener noreferrer">
        ${img ? `<img src="${img}" alt="${article.title}" loading="lazy">` : ''}
        <h3>${article.title}</h3>
      </a>
      <p>${article.description || article.content || ''}</p>
      <small>${new Date(article.publishedAt || article.pubDate).toLocaleString()}</small>
    `;
    container.appendChild(div);
  });
}

// Busca notícias da NewsAPI
async function fetchNewsAPI(category) {
  try {
    const url = `https://newsapi.org/v2/top-headlines?country=br&category=${categoryMap[category].newsapi}&apiKey=${API_KEYS.newsapi}&pageSize=5`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'ok') return data.articles;
    console.error('NewsAPI error:', data);
    return [];
  } catch (e) {
    console.error('Erro NewsAPI:', e);
    return [];
  }
}

// Busca notícias da GNews
async function fetchGNews(category) {
  try {
    const url = `https://gnews.io/api/v4/top-headlines?topic=${categoryMap[category].gnews}&lang=pt&token=${API_KEYS.gnews}&max=5`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.articles) return data.articles;
    console.error('GNews error:', data);
    return [];
  } catch (e) {
    console.error('Erro GNews:', e);
    return [];
  }
}

// Busca vídeos do YouTube na categoria (busca vídeos recentes e relevantes)
async function fetchYouTubeVideos(category) {
  try {
    const q = categoryMap[category].youtube;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${q}&type=video&key=${API_KEYS.youtube}&regionCode=BR&relevanceLanguage=pt`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items) return [];

    // Converte itens em formato similar a artigos para renderizar
    return data.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      urlToImage: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt
    }));
  } catch (e) {
    console.error('Erro YouTube:', e);
    return [];
  }
}

// Busca e parseia feed RSS via proxy
async function fetchRSSFeeds(feeds) {
  let allItems = [];

  for (const feedUrl of feeds) {
    try {
      const encoded = encodeURIComponent(feedUrl);
      const res = await fetch(proxyUrl + encoded);
      const data = await res.json();

      // Parse XML (string) para DOM
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
      const items = xmlDoc.querySelectorAll('item');

      items.forEach(item => {
        allItems.push({
          title: item.querySelector('title')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
          url: item.querySelector('link')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || ''
        });
      });
    } catch (e) {
      console.error('Erro ao carregar RSS:', e);
    }
  }

  // Limita a 5 notícias para não poluir
  return allItems.slice(0, 5);
}

// Função principal para carregar e mostrar notícias
async function loadNews() {
  const category = detectCategory();

  const [newsapiArticles, gnewsArticles, youtubeVideos, rssArticles] = await Promise.all([
    fetchNewsAPI(category),
    fetchGNews(category),
    fetchYouTubeVideos(category),
    fetchRSSFeeds(categoryMap[category].rss)
  ]);

  // Junta e remove duplicados (baseado no título)
  const combined = [...newsapiArticles, ...gnewsArticles, ...youtubeVideos, ...rssArticles];
  const seenTitles = new Set();
  const uniqueArticles = combined.filter(article => {
    if (!article.title) return false;
    if (seenTitles.has(article.title)) return false;
    seenTitles.add(article.title);
    return true;
  });

  renderNews(uniqueArticles);
}

window.addEventListener('DOMContentLoaded', loadNews);
    
