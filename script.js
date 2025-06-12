// Tema claro/escuro
(function() {
  const themeBtn = document.getElementById('themeToggle');
  const html = document.documentElement;
  function setTheme(t) { html.setAttribute('data-theme', t); localStorage.setItem('theme', t); themeBtn.innerHTML = t==='dark' ? feather.icons.sun.toSvg() : feather.icons.moon.toSvg(); }
  themeBtn.onclick = () => setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  let st = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(st);
})();

// Menu retrátil mobile
(function() {
  const sidebar = document.getElementById('sidebarNav');
  const toggle = document.getElementById('sidebarToggle');
  toggle.onclick = () => { sidebar.classList.toggle('open'); toggle.setAttribute('aria-expanded', sidebar.classList.contains('open')); };
  window.onclick = e => { if(window.innerWidth<900 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) sidebar.classList.remove('open'); };
})();

// Search
(function() {
  const form = document.getElementById('searchForm');
  form.onsubmit = e => {
    e.preventDefault();
    let v = form.searchInput.value.trim().toLowerCase();
    if(!v) return;
    let found = false;
    document.querySelectorAll('.news-card').forEach(card => {
      let txt = card.textContent.toLowerCase();
      card.style.display = txt.includes(v) ? '' : 'none';
      if(txt.includes(v)) found = true;
    });
    if(!found) alert('Nenhuma notícia encontrada para "'+v+'"');
  };
})();

// Exibir notícias com compartilhamento
window.exibirNoticias = function(selecao, noticias, fonte) {
  const grid = document.getElementById(selecao);
  if (!grid) return;
  grid.innerHTML = noticias.map(noticia => `
    <div class="news-card${noticia.isUrgent ? ' urgent' : ''}" tabindex="0">
      ${noticia.isUrgent ? `<span class="urgent-badge"><i data-feather="alert-triangle"></i> URGENTE</span>` : ""}
      ${noticia.thumbnail ? `<img class="news-image" src="${noticia.thumbnail}" alt="${noticia.title || ''}" loading="lazy">` : ""}
      <div class="news-title">${noticia.title}</div>
      <div class="news-meta">
        ${noticia.pubDate ? new Date(noticia.pubDate).toLocaleString('pt-BR') : ""}
      </div>
      <div class="news-summary">${noticia.description ? noticia.description.substring(0, 140) + '...' : ""}</div>
      <a class="news-link" href="${noticia.link}" target="_blank" rel="noopener" aria-label="Abrir notícia em nova guia">Ler notícia</a>
      <span class="news-source">Fonte: ${fonte}</span>
      <div class="news-share" style="margin-top:0.5em;">
        <button onclick="navigator.share ? navigator.share({title: '${noticia.title}', url: '${noticia.link}'}) : window.open('https://api.whatsapp.com/send?text='+encodeURIComponent('${noticia.title} - ${noticia.link}'))" title="Compartilhar" aria-label="Compartilhar notícia">
          <i data-feather="share-2"></i>
        </button>
        <button onclick="navigator.clipboard.writeText('${noticia.title} - ${noticia.link}');alert('Link copiado!')" title="Copiar link" aria-label="Copiar link">
          <i data-feather="copy"></i>
        </button>
      </div>
    </div>
  `).join('');
  if(window.feather) feather.replace();
}

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

  // Destaques + Breaking (igual anterior)
  setTimeout(() => {
    // ...destaques/breaking igual como já foi implementado antes...
  }, 2200);
});
