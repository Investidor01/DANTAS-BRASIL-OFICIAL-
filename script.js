// Suas chaves de API:
const YOUTUBE_API_KEY = 'AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A';
const GNEWS_API_KEY = '92221e88091bab959857e1a937a68fc9';
const NEWSAPI_API_KEY = '92221e88091bab959857e1a937a68fc9'; // Substitua se quiser, ou use GNews só
// Você não passou chave da NewsAPI, apenas da GNews e YouTube. Usei GNews aqui.

const categoryMap = {
  'index.html': '', // Home pega notícias gerais
  'politica.html': 'politics',
  'esportes.html': 'sports',
  'tecnologia.html': 'technology',
  'entretenimento.html': 'entertainment',
};

const page = window.location.pathname.split('/').pop();
const category = categoryMap[page] || '';

const newsContainer = document.getElementById('news-container');

// Função para formatar datas
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Função para criar card de notícia
function createNewsItem(article) {
  const div = document.createElement('div');
  div.className = 'news-item';

  const imgSrc = article.image || article.urlToImage || '';
  const img = imgSrc
    ? `<img src="${imgSrc}" alt="${article.title}" />`
    : '';

  div.innerHTML = `
    ${img}
    <h3><a href="${article.url}" target="_blank" rel="noopener">${article.title}</a></h3>
    <p>${article.description || ''}</p>
    <small>${article.source?.name || ''} - ${formatDate(article.publishedAt)}</small>
  `;

  return div;
}

// Buscar notícias da GNews API
async function fetchGNews(category) {
  let url = `https://gnews.io/api/v4/top-headlines?lang=pt&max=10&apikey=${GNEWS_API_KEY}`;
  if (category) {
    url += `&topic=${category}`;
  }
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.articles) {
      return data.articles.map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.image,
        publishedAt: a.publishedAt,
        source: { name: a.source.name },
      }));
    }
  } catch (err) {
    console.error('Erro GNews:', err);
  }
  return [];
}

// Buscar feed RSS (exemplo feed globoesporte para esportes)
// Como só podemos fazer CORS em front se o feed liberar, usaremos proxy público para dev
async function fetchRSS(url) {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, 'application/xml');
    const items = [...xml.querySelectorAll('item')].slice(0, 5);
    return items.map(item => ({
      title: item.querySelector('title')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      url: item.querySelector('link')?.textContent || '',
      pubDate: item.querySelector('pubDate')?.textContent || '',
      image: '', // rss simples sem imagens, ou tente extrair
    }));
  } catch (err) {
    console.error('Erro RSS:', err);
    return [];
  }
}

// Carregar notícias e mostrar na página
async function loadNews() {
  newsContainer.innerHTML = `<p>Carregando notícias...</p>`;

  // Pega notícias GNews
  const gnewsArticles = await fetchGNews(category);

  // Pega RSS específico por categoria
  let rssArticles = [];
  if (category === 'sports') {
    rssArticles = await fetchRSS('https://globoesporte.globo.com/rss/gauchazh/futebol-rs/');
  } else if (category === 'politics') {
    rssArticles = await fetchRSS('https://rss.uol.com.br/feed/politica.xml');
  } else if (category === 'technology') {
    rssArticles = await fetchRSS('https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml');
  } else if (category === 'entertainment') {
    rssArticles = await fetchRSS('https://rss.cnn.com/rss/edition_entertainment.rss');
  }

  // Juntando e ordenando (colocando GNews e RSS)
  const combined = [...gnewsArticles, ...rssArticles].slice(0, 10);

  if (combined.length === 0) {
    newsContainer.innerHTML = `<p>Não foi possível carregar as notícias no momento.</p>`;
    return;
  }

  newsContainer.innerHTML = '';
  combined.forEach(article => {
    newsContainer.appendChild(createNewsItem(article));
  });
}

window.addEventListener('DOMContentLoaded', loadNews);
