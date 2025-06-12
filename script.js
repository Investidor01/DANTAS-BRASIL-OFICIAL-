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

function criarNoticiaHTML(noticia, fonte) {
  return `
    <article class="news-article">
      ${noticia.thumbnail ? `<img class="news-image" src="${noticia.thumbnail}" alt="${noticia.title}" loading="lazy">` : `<div class="news-image" style="height:180px;display:flex;align-items:center;justify-content:center;background:#e3e7ef;color:#bbb;">Sem imagem</div>`}
      <div class="news-content">
        <h3 class="news-title">${noticia.title}</h3>
        <div class="news-meta">
          ${noticia.pubDate ? new Date(noticia.pubDate).toLocaleString('pt-BR') : ""}
        </div>
        <p class="news-summary">${noticia.description ? noticia.description.replace(/<[^>]+>/g, '').substr(0, 160) + '...' : ""}</p>
        <div class="news-footer">
          <a class="read-more-btn" href="${noticia.link}" target="_blank" rel="noopener" title="Ler matéria completa">
            <i data-feather="external-link"></i> Ler mais
          </a>
          <span class="news-source">${fonte}</span>
        </div>
      </div>
    </article>
  `;
}

async function buscarFeedRSS(feed) {
  const grid = document.getElementById(feed.secao);
  if (grid) grid.innerHTML = "<div class='loading'>Carregando notícias...</div>";
  try {
    const res = await fetch(feed.url);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      grid.innerHTML = data.items.slice(0, 10).map(noticia => criarNoticiaHTML(noticia, feed.nome)).join('');
      if(window.feather) feather.replace();
    } else {
      throw new Error("Nenhuma notícia encontrada");
    }
  } catch (e) {
    if (grid) grid.innerHTML = `<p style="color:#c00">Erro ao carregar notícias de ${feed.nome}.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  RSS_FEEDS.forEach(feed => buscarFeedRSS(feed));
  if(window.feather) feather.replace();
});
