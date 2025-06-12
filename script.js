// ======= RSS FEEDS =======
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
  },
  {
    nome: "Band",
    cor: "band",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://banduol.nyc3.cdn.digitaloceanspaces.com/rss/bandnews.xml"
  },
  {
    nome: "Metrópoles",
    cor: "metropoles",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.metropoles.com/feed"
  },
  {
    nome: "O Globo",
    cor: "oglobo",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://oglobo.globo.com/rss.xml"
  },
  {
    nome: "Gazeta do Povo",
    cor: "gazeta",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.gazetadopovo.com.br/rss/ultimas-noticias/"
  },
  {
    nome: "Valor Econômico",
    cor: "valor",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://valor.globo.com/rss/"
  }
];

// ======= BREAKING KEYWORDS =======
const breakingKeywords = [
  "URGENTE", "BREAKING", "LUTO", "URGÊNCIA", "ATENÇÃO", "GRAVE", "ALERTA", "EXPLODE", "TRAGÉDIA", "EMERGÊNCIA", "ACIDENTE", "TIROTEIO", "FATAL", "MORRE", "MORTE", "PANDEMIA", "COVID", "EVACUAÇÃO"
];

// ======= HTML SANITIZER =======
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.innerHTML = str || '';
  return temp.textContent || temp.innerText || '';
}

// ======= BREAKING NEWS DETECTOR =======
function noticiaIsBreaking(noticia) {
  const t = (noticia.title || '') + ' ' + (noticia.description || '');
  return breakingKeywords.some(kw => t.toUpperCase().includes(kw));
}

// ======= RENDER NOTÍCIAS =======
function renderNoticias(rss, noticias, highlightBreaking = false) {
  return noticias.map(noticia => {
    const isBreaking = noticiaIsBreaking(noticia);
    const title = encodeURIComponent(sanitizeHTML(noticia.title));
    const url = encodeURIComponent(noticia.link);
    return `
    <div class="news-card${highlightBreaking && isBreaking ? ' breaking' : ''}">
      ${
        noticia.thumbnail
        ? `<img class="news-image" src="${noticia.thumbnail}" alt="${sanitizeHTML(noticia.title)}">`
        : `<div class="news-image" style="background:#e3e7ef;color:#bbb;display:flex;align-items:center;justify-content:center;">Sem imagem</div>`
      }
      <div class="news-content">
        <div class="news-title">${sanitizeHTML(noticia.title)}${isBreaking && highlightBreaking ? ' <span style="color:#c62828; font-size:0.9em;">[URGENTE]</span>' : ''}</div>
        <div class="news-meta">${noticia.pubDate ? new Date(noticia.pubDate).toLocaleString('pt-BR') : ""}</div>
        <div class="news-summary">${sanitizeHTML(noticia.description).slice(0, 180)}...</div>
        <div class="news-footer">
          <a class="read-more-btn" href="${noticia.link}" target="_blank" rel="noopener">Ler mais</a>
          <span class="news-source">${rss.nome}</span>
        </div>
        <div class="news-share">
          <button onclick="window.open('https://api.whatsapp.com/send?text='+encodeURIComponent('${sanitizeHTML(noticia.title)} ${noticia.link}'))" title="Compartilhar no WhatsApp">📱</button>
          <button onclick="window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('${sanitizeHTML(noticia.title)} ${noticia.link}'))" title="Compartilhar no X/Twitter">𝕏</button>
          <button onclick="navigator.clipboard.writeText('${sanitizeHTML(noticia.title)} ${noticia.link}');alert('Link copiado!')" title="Copiar link">🔗</button>
        </div>
      </div>
    </div>
    `;
  }).join('');
}

// ======= CARREGAR NOTÍCIAS DE UM PORTAL =======
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

// ======= BREAKING NEWS AGREGADAS =======
function carregarBreakingNews() {
  const breakingGrid = document.getElementById('news-breaking');
  breakingGrid.innerHTML = `<div class="loading">Carregando breaking news...</div>`;
  let allBreaking = [];
  let loaded = 0;
  RSS_FEEDS.forEach(rss =>
    fetch(rss.url)
      .then(r => r.json())
      .then(data => {
        if (data.items && data.items.length) {
          const breaking = data.items.filter(noticiaIsBreaking);
          allBreaking = allBreaking.concat(breaking.map(n => ({ ...n, fonte: rss.nome })));
        }
      })
      .finally(() => {
        loaded++;
        if (loaded === RSS_FEEDS.length) {
          if (allBreaking.length > 0) {
            // Ordena por mais recente
            allBreaking.sort((a, b) => (b.pubDate || '').localeCompare(a.pubDate || ''));
            breakingGrid.innerHTML = allBreaking.slice(0, 8).map(noticia => {
              const title = encodeURIComponent(sanitizeHTML(noticia.title));
              const url = encodeURIComponent(noticia.link);
              return `
              <div class="news-card breaking">
                ${noticia.thumbnail
                  ? `<img class="news-image" src="${noticia.thumbnail}" alt="${sanitizeHTML(noticia.title)}">`
                  : `<div class="news-image" style="background:#e3e7ef;color:#bbb;display:flex;align-items:center;justify-content:center;">Sem imagem</div>`
                }
                <div class="news-content">
                  <div class="news-title">${sanitizeHTML(noticia.title)} <span style="color:#c62828; font-size:0.9em;">[URGENTE]</span></div>
                  <div class="news-meta">${noticia.pubDate ? new Date(noticia.pubDate).toLocaleString('pt-BR') : ""}</div>
                  <div class="news-summary">${sanitizeHTML(noticia.description).slice(0, 180)}...</div>
                  <div class="news-footer">
                    <a class="read-more-btn" href="${noticia.link}" target="_blank" rel="noopener">Ler mais</a>
                    <span class="news-source">${noticia.fonte}</span>
                  </div>
                  <div class="news-share">
                    <button onclick="window.open('https://api.whatsapp.com/send?text='+encodeURIComponent('${sanitizeHTML(noticia.title)} ${noticia.link}'))" title="Compartilhar no WhatsApp">📱</button>
                    <button onclick="window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('${sanitizeHTML(noticia.title)} ${noticia.link}'))" title="Compartilhar no X/Twitter">𝕏</button>
                    <button onclick="navigator.clipboard.writeText('${sanitizeHTML(noticia.title)} ${noticia.link}');alert('Link copiado!')" title="Copiar link">🔗</button>
                  </div>
                </div>
              </div>
            `}).join('');
            mostrarBreakingBar(allBreaking.slice(0, 5));
          } else {
            breakingGrid.innerHTML = `<div class="error-msg">Nenhuma breaking news no momento.</div>`;
            document.getElementById('breakingBar').style.display = 'none';
          }
        }
      })
  );
}

// ======= BREAKING BAR NO TOPO =======
function mostrarBreakingBar(breaking) {
  const bar = document.getElementById('breakingBar');
  if (breaking.length === 0) {
    bar.style.display = 'none';
    return;
  }
  bar.classList.add('active');
  bar.innerHTML = `<span>🔴 URGENTE:</span> <div class="breaking-marquee"><span>${
    breaking.map(n => `<a href="${n.link}" target="_blank" style="color:#fff;text-decoration:underline;margin-right:2.1em;">${sanitizeHTML(n.title)}</a>`).join(" — ")
  }</span></div>`;
  bar.style.display = 'flex';
}

// ======= MODO ESCURO FORÇADO =======
document.body.setAttribute('data-theme', 'dark');
localStorage.setItem('theme', 'dark');

// Remove ou esconde o botão de alternância de tema caso exista
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) themeToggleBtn.style.display = 'none';

// ======= BUSCA INSTANTÂNEA =======
document.getElementById('searchForm').onsubmit = function(e) { e.preventDefault(); };
document.getElementById('searchInput').oninput = function() {
  const v = this.value.trim().toLowerCase();
  document.querySelectorAll('.news-card').forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(v) ? '' : 'none';
  });
};

// ======= MENU PORTAIS: ROLAGEM SUAVE =======
document.querySelectorAll('.portais-navbar a').forEach(link => {
  link.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    const sec = document.querySelector(id);
    if (sec) {
      e.preventDefault();
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const h2 = sec.querySelector('h2');
      if (h2) h2.setAttribute('tabindex', '-1'), h2.focus();
    }
  });
});

// ======= INICIALIZAÇÃO =======
document.addEventListener('DOMContentLoaded', function () {
  carregarBreakingNews();
  RSS_FEEDS.forEach(carregarNoticias);
});
