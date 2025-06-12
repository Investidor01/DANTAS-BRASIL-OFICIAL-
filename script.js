// ===================== FONTES RSS GERAIS ======================
const RSS_SOURCES = [
  { name: "G1", id: "g1", url: "https://g1.globo.com/rss/g1/", categorias: ["principais", "politica", "economia", "mundo"] },
  { name: "BBC", id: "bbc", url: "https://feeds.bbci.co.uk/portuguese/rss.xml", categorias: ["mundo"] },
  { name: "UOL", id: "uol", url: "https://rss.uol.com.br/feed/noticias.xml", categorias: ["principais", "economia", "mundo"] }
];
let allNews = [];
let filteredNews = [];
let carouselNews = [];
let mostRead = [];

async function fetchAllRSS() {
  const corsProxy = "https://api.allorigins.win/get?url=";
  allNews = [];
  for (const src of RSS_SOURCES) {
    try {
      const resp = await fetch(corsProxy + encodeURIComponent(src.url));
      const data = await resp.json();
      const parser = new DOMParser();
      const xml = parser.parseFromString(data.contents, "text/xml");
      const items = xml.querySelectorAll("item");
      for (let i = 0; i < Math.min(12, items.length); i++) {
        const item = items[i];
        const title = item.querySelector("title")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "";
        const description = item.querySelector("description")?.textContent || "";
        const pubDate = item.querySelector("pubDate")?.textContent || "";
        const category = (item.querySelector("category")?.textContent || src.categorias[0] || "principais").toLowerCase();
        const image = item.querySelector("media\\:content, enclosure, image, img")?.getAttribute("url") ||
                      (description.match(/<img.*?src="(.*?)"/) || [])[1] || `https://source.unsplash.com/400x200/?news,${src.id}`;
        allNews.push({
          source: src.name,
          sourceId: src.id,
          title,
          link,
          description: description.replace(/(<([^>]+)>)/gi, "").slice(0, 120) + "...",
          pubDate,
          image,
          category,
          author: src.name // Simulação de autor
        });
      }
    } catch (e) {}
  }
  allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

function renderNewsGrid() {
  const newsGrid = document.getElementById('news-grid');
  newsGrid.innerHTML = '';
  if (!filteredNews.length) {
    newsGrid.innerHTML = '<div class="loading">Nenhuma notícia encontrada.</div>';
    return;
  }
  for (const news of filteredNews) {
    const article = document.createElement('article');
    article.innerHTML = `
      <img src="${news.image}" alt="${news.title}" loading="lazy">
      <span class="news-source">${news.source}</span>
      <h3>${news.title}</h3>
      <div class="author">Por ${news.author} &bull; ${formatDate(news.pubDate)}</div>
      <p>${news.description}</p>
      <a href="${news.link}" target="_blank" rel="noopener" onclick="registerRead('${news.link}')">Leia mais</a>
    `;
    newsGrid.appendChild(article);
  }
}
function renderMostRead() {
  const list = document.getElementById('most-read-list');
  list.innerHTML = '';
  mostRead.slice(0, 5).forEach(news => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${news.link}" target="_blank" rel="noopener">${news.title}</a>`;
    list.appendChild(li);
  });
}
function registerRead(link) {
  const news = allNews.find(n => n.link === link);
  if (!news) return;
  let reads = JSON.parse(localStorage.getItem('mostRead') || '[]');
  if (!reads.some(r => r.link === link)) {
    reads.unshift({ title: news.title, link: news.link });
    if (reads.length > 10) reads = reads.slice(0, 10);
    localStorage.setItem('mostRead', JSON.stringify(reads));
    mostRead = reads;
    renderMostRead();
  }
}
function applyFilters() {
  const source = document.getElementById('source-filter').value;
  const keyword = document.getElementById('keyword-filter').value.toLowerCase();
  const category = document.getElementById('category-filter').value;
  filteredNews = allNews.filter(news =>
    (source === "all" || news.sourceId === source) &&
    (category === "all" || (news.category && news.category.includes(category))) &&
    (!keyword || news.title.toLowerCase().includes(keyword) || news.description.toLowerCase().includes(keyword))
  );
  renderNewsGrid();
  setupCarousel();
  renderBreadcrumb();
}
function setupCarousel() {
  carouselNews = filteredNews.slice(0, 5);
  const carouselInner = document.getElementById('carousel-inner');
  carouselInner.innerHTML = '';
  carouselNews.forEach((news, idx) => {
    const div = document.createElement('div');
    div.className = 'carousel-item' + (idx === 0 ? ' active' : '');
    div.innerHTML = `
      <img src="${news.image}" alt="${news.title}">
      <div class="carousel-caption">
        <span class="news-source">${news.source}</span>
        <h3>${news.title}</h3>
        <a href="${news.link}" target="_blank" rel="noopener" onclick="registerRead('${news.link}')">Leia mais</a>
      </div>
    `;
    carouselInner.appendChild(div);
  });
  currentCarouselIdx = 0;
  updateCarousel();
}
let currentCarouselIdx = 0;
let carouselInterval = null;
function updateCarousel() {
  const items = document.querySelectorAll('.carousel-item');
  items.forEach((item, idx) => {
    item.classList.toggle('active', idx === currentCarouselIdx);
  });
}
function nextCarousel() {
  if (!carouselNews.length) return;
  currentCarouselIdx = (currentCarouselIdx + 1) % carouselNews.length;
  updateCarousel();
}
function prevCarousel() {
  if (!carouselNews.length) return;
  currentCarouselIdx = (currentCarouselIdx - 1 + carouselNews.length) % carouselNews.length;
  updateCarousel();
}
function startCarouselAuto() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(nextCarousel, 5000);
}
document.getElementById('carousel-next').onclick = () => { nextCarousel(); startCarouselAuto(); };
document.getElementById('carousel-prev').onclick = () => { prevCarousel(); startCarouselAuto(); };
function renderBreadcrumb() {
  const source = document.getElementById('source-filter').value;
  const category = document.getElementById('category-filter').value;
  let path = `<a href="/">Início</a>`;
  if (source !== "all") path += ` / <span>${source.toUpperCase()}</span>`;
  if (category !== "all") path += ` / <span>${capitalize(category)}</span>`;
  document.getElementById('breadcrumb').innerHTML = path;
}
const searchInput = document.getElementById('search-input');
const suggestionsBox = document.getElementById('search-suggestions');
searchInput.addEventListener('input', function() {
  const val = this.value.trim().toLowerCase();
  if (!val) { suggestionsBox.innerHTML = ""; suggestionsBox.classList.remove("active"); return; }
  const suggestions = allNews.filter(news => news.title.toLowerCase().includes(val)).slice(0, 5);
  if (!suggestions.length) { suggestionsBox.innerHTML = ""; suggestionsBox.classList.remove("active"); return; }
  suggestionsBox.innerHTML = "";
  suggestions.forEach(news => {
    const div = document.createElement('div');
    div.innerHTML = news.title;
    div.onclick = () => { searchInput.value = news.title; applyFilters(); suggestionsBox.innerHTML = ""; suggestionsBox.classList.remove("active"); };
    suggestionsBox.appendChild(div);
  });
  suggestionsBox.classList.add("active");
});
document.getElementById('search-form').onsubmit = function(e) {
  e.preventDefault();
  applyFilters();
  suggestionsBox.innerHTML = "";
  suggestionsBox.classList.remove("active");
};
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = function() {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}
document.getElementById('newsletter-form').onsubmit = function(e) {
  e.preventDefault();
  document.getElementById('newsletter-msg').textContent = "Obrigado por se inscrever! (Simulação)";
  setTimeout(() => document.getElementById('newsletter-msg').textContent = "", 4000);
  this.reset();
};
document.getElementById('contact-form').onsubmit = function(e) {
  e.preventDefault();
  document.getElementById('contact-msg').textContent = "Mensagem enviada! (Simulação)";
  setTimeout(() => document.getElementById('contact-msg').textContent = "", 4000);
  this.reset();
};
document.querySelector('.support-btn').onclick = function() {
  alert('Chave PIX: pix@infodantasbrasil.com.br (simulação)');
};
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function formatDate(str) {
  const d = new Date(str);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
async function initializeNews() {
  document.getElementById('news-grid').innerHTML = '<div class="loading">Carregando notícias de múltiplas fontes...</div>';
  await fetchAllRSS();
  filteredNews = allNews;
  renderNewsGrid();
  setupCarousel();
  renderBreadcrumb();
  startCarouselAuto();
  mostRead = JSON.parse(localStorage.getItem('mostRead') || '[]');
  renderMostRead();
}
document.getElementById('filters-form').onsubmit = function(e) {
  e.preventDefault();
  applyFilters();
  startCarouselAuto();
};
initializeNews();

// ======================== INVESTIMENTOS E BOLSA ========================
const INVESTIMENTOS_SOURCES = [
  {
    name: "InfoMoney",
    url: "https://www.infomoney.com.br/mercados/rss/",
    source: "InfoMoney"
  },
  {
    name: "Exame Invest",
    url: "https://exame.com/invest/ultimas/feed/",
    source: "Exame"
  },
  {
    name: "Investing.com Brasil",
    url: "https://www.investing.com/rss/news_285.rss",
    source: "Investing"
  }
];
async function fetchInvestimentosNews() {
  const corsProxy = "https://api.allorigins.win/get?url=";
  let investimentosNews = [];
  for (const src of INVESTIMENTOS_SOURCES) {
    try {
      const resp = await fetch(corsProxy + encodeURIComponent(src.url));
      const data = await resp.json();
      const parser = new DOMParser();
      const xml = parser.parseFromString(data.contents, "text/xml");
      const items = xml.querySelectorAll("item");
      for (let i = 0; i < Math.min(4, items.length); i++) {
        const item = items[i];
        const title = item.querySelector("title")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "";
        const description = item.querySelector("description")?.textContent || "";
        const pubDate = item.querySelector("pubDate")?.textContent || "";
        const image = (description.match(/<img.*?src="(.*?)"/) || [])[1] || "https://source.unsplash.com/400x200/?stock-market,finance";
        investimentosNews.push({
          title,
          link,
          description: description.replace(/(<([^>]+)>)/gi, "").slice(0, 120) + "...",
          pubDate,
          image,
          source: src.source
        });
      }
    } catch (e) {}
  }
  investimentosNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  renderInvestimentosNews(investimentosNews);
}
function renderInvestimentosNews(newsArray) {
  const container = document.getElementById('investimentos-news');
  if (!container) return;
  container.innerHTML = '';
  if (!newsArray.length) {
    container.innerHTML = "<div class='loading'>Nenhuma notícia encontrada.</div>";
    return;
  }
  newsArray.forEach(news => {
    const art = document.createElement('article');
    art.innerHTML = `
      <img src="${news.image}" alt="${news.title}" loading="lazy">
      <div class="source">${news.source}</div>
      <h3>${news.title}</h3>
      <p>${news.description}</p>
      <a href="${news.link}" target="_blank" rel="noopener">Leia mais</a>
    `;
    container.appendChild(art);
  });
}
fetchInvestimentosNews();

// ======================== COTAÇÕES DA B3 ========================
const COTACOES_TICKERS = [
  { ticker: "PETR4", nome: "Petrobras PN" },
  { ticker: "VALE3", nome: "Vale ON" },
  { ticker: "ITUB4", nome: "Itaú Unibanco PN" },
  { ticker: "BBDC4", nome: "Bradesco PN" },
  { ticker: "B3SA3", nome: "B3 ON" },
  { ticker: "BBAS3", nome: "Banco do Brasil ON" },
  { ticker: "MGLU3", nome: "Magazine Luiza ON" }
];
async function fetchCotacoes() {
  const box = document.getElementById("cotacoes-box");
  box.innerHTML = "<div class='loading'>Carregando cotações...</div>";
  try {
    const tickersStr = COTACOES_TICKERS.map(t => t.ticker).join(",");
    const resp = await fetch(`https://brapi.dev/api/quote/${tickersStr}?range=1d&interval=1d&fundamental=false`);
    const data = await resp.json();
    if (!data || !data.results || !data.results.length) throw new Error();
    box.innerHTML = "";
    data.results.forEach((res, i) => {
      const cot = document.createElement("div");
      cot.className = "cotacao-card";
      const variacao = res.change_percent || 0;
      cot.innerHTML = `
        <span class="cotacao-ticker">${res.symbol}</span>
        <span class="cotacao-preco">R$ ${Number(res.regularMarketPrice).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
        <span class="cotacao-var ${variacao >= 0 ? "up" : "down"}">${variacao >= 0 ? "▲" : "▼"} ${variacao.toFixed(2)}%</span>
        <span class="cotacao-nome">${COTACOES_TICKERS[i].nome}</span>
      `;
      box.appendChild(cot);
    });
  } catch (e) {
    box.innerHTML = "<div class='loading'>Não foi possível carregar as cotações agora :(</div>";
  }
}
fetchCotacoes();
setInterval(fetchCotacoes, 120000); // Atualiza a cada 2 minutos
