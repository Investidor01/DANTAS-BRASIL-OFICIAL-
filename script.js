const RSS_FEEDS = [
  {
    nome: "G1",
    url: "https://rss2json.com/api.json?rss_url=https://g1.globo.com/rss/g1/",
    secao: "news-g1"
  },
  {
    nome: "UOL",
    url: "https://rss2json.com/api.json?rss_url=https://rss.uol.com.br/feed/noticias.xml",
    secao: "news-uol"
  },
  {
    nome: "Estadão",
    url: "https://rss2json.com/api.json?rss_url=https://feeds.folha.uol.com.br/emcimadahora/rss091.xml",
    secao: "news-estadao"
  },
  {
    nome: "Folha",
    url: "https://rss2json.com/api.json?rss_url=https://feeds.folha.uol.com.br/emcimadahora/rss091.xml",
    secao: "news-folha"
  },
  {
    nome: "R7",
    url: "https://rss2json.com/api.json?rss_url=https://static.r7.com/rss/mais-vistas.xml",
    secao: "news-r7"
  },
  {
    nome: "Terra",
    url: "https://rss2json.com/api.json?rss_url=https://www.terra.com.br/rss/0,,EI1,00.xml",
    secao: "news-terra"
  },
  {
    nome: "CNN Brasil",
    url: "https://rss2json.com/api.json?rss_url=https://www.cnnbrasil.com.br/feed/",
    secao: "news-cnnbr"
  }
];

window.exibirNoticias = function(selecao, noticias, fonte) {
  const grid = document.getElementById(selecao);
  if (!grid) return;
  grid.innerHTML = noticias.map(noticia => `
    <div class="news-card${noticia.isUrgent ? ' urgent' : ''}">
      ${noticia.isUrgent ? `<span class="urgent-badge"><i data-feather="alert-triangle"></i> URGENTE</span>` : ""}
      ${noticia.thumbnail ? `<img class="news-image" src="${noticia.thumbnail}" alt="Notícia">` : ""}
      <div class="news-title">${noticia.title}</div>
      <div class="news-meta">
        ${noticia.pubDate ? new Date(noticia.pubDate).toLocaleString('pt-BR') : ""}
      </div>
      <div class="news-summary">${noticia.description ? noticia.description.substring(0, 140) + '...' : ""}</div>
      <a class="news-link" href="${noticia.link}" target="_blank" rel="noopener">Ler notícia</a>
      <span class="news-source">Fonte: ${fonte}</span>
    </div>
  `).join('');
  if(window.feather) feather.replace();
}

async function buscarFeedRSS(feed) {
  const grid = document.getElementById(feed.secao);
  if (grid) grid.innerHTML = "<div class='loading'>Carregando notícias...</div>";
  try {
    const res = await fetch(feed.url);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      window.exibirNoticias(feed.secao, data.items.slice(0, 8), feed.nome);
    } else {
      throw new Error("Nenhuma notícia encontrada");
    }
  } catch (e) {
    if (grid) grid.innerHTML = `<p style="color:#c00">Erro ao carregar notícias de ${feed.nome}.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  RSS_FEEDS.forEach(feed => buscarFeedRSS(feed));
});
