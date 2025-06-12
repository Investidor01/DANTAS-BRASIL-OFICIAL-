// Portais e RSS: Para produção troque por backend próprio se necessário
const RSS_FEEDS = [
  {
    nome: "G1",
    cor: "g1",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://g1.globo.com/rss/g1/"
  },
  {
    nome: "UOL",
    cor: "uol",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://rss.uol.com.br/feed/noticias.xml"
  },
  {
    nome: "Estadão",
    cor: "estadao",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.folha.uol.com.br/emcimadahora/rss091.xml"
  },
  {
    nome: "Folha",
    cor: "folha",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.folha.uol.com.br/emcimadahora/rss091.xml"
  },
  {
    nome: "R7",
    cor: "r7",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://static.r7.com/rss/mais-vistas.xml"
  },
  {
    nome: "Terra",
    cor: "terra",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.terra.com.br/rss/0,,EI1,00.xml"
  },
  {
    nome: "CNN Brasil",
    cor: "cnnbr",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.cnnbrasil.com.br/feed/"
  }
];

function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.innerHTML = str || '';
  return temp.textContent || temp.innerText || '';
}

function renderNoticias(rss, noticias) {
  return noticias.map(noticia => `
    <div class="news-card">
      ${
        noticia.thumbnail
        ? `<img class="news-image" src="${noticia.thumbnail}" alt="${sanitizeHTML(noticia.title)}">`
        : `<div class="news-image" style="background:#e3e7ef;color:#bbb;display:flex;align-items:center;justify-content:center;">Sem imagem</div>`
      }
      <div class="news-content">
        <div class="news-title">${sanitizeHTML(noticia.title)}</div>
        <div class="news-meta">${noticia.pubDate ? new Date(noticia.pubDate).toLocaleString('pt-BR') : ""}</div>
        <div class="news-summary">${sanitizeHTML(noticia.description).slice(0, 180)}...</div>
        <div class="news-footer">
          <a class="read-more-btn" href="${noticia.link}" target="_blank" rel="noopener">Ler mais</a>
          <span class="news-source">${rss.nome}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function carregarNoticias(rss) {
  const grid = document.getElementById('news-' + rss.cor);
  if (!grid) return;
  grid.innerHTML = `<div class="loading">Carregando notícias...</div>`;
  fetch(rss.url)
    .then(r => r.json())
    .then(data => {
      if (data.items && data.items.length) {
        grid.innerHTML = renderNoticias(rss, data.items.slice(0, 10));
      } else {
        grid.innerHTML = `<div class="error-msg">Nenhuma notícia encontrada.</div>`;
      }
    })
    .catch(() => {
      grid.innerHTML = `<div class="error-msg">Erro ao carregar notícias de ${rss.nome}.<br>Tente novamente em instantes.</div>`;
    });
}

document.addEventListener('DOMContentLoaded', function () {
  RSS_FEEDS.forEach(carregarNoticias);
});
