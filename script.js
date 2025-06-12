// script.js
// BLOCO DE ATIVOS (BOLSA)
const ativos = [
  { nome: "IBOVESPA", simbolo: "^BVSP" },
  { nome: "PETR4", simbolo: "PETR4.SA" },
  { nome: "VALE3", simbolo: "VALE3.SA" },
  { nome: "ITUB4", simbolo: "ITUB4.SA" }
];

function criarLinhaAltaBaixaAtivos() {
  const linha = document.getElementById('linha-alta-baixa');
  linha.innerHTML = ativos.map(ativo => `
    <div class="ativo-bloco" id="bloco-${ativo.simbolo.replace(/[^a-zA-Z0-9]/g, '')}">
      <strong>${ativo.nome}</strong>
      <span>Preço: <span class="valor-atual">---</span></span>
      <span>Alta: <span class="alta valor-alta">---</span> &nbsp;Baixa: <span class="baixa valor-baixa">---</span></span>
      <span>Variação: <span class="variacao">---</span></span>
    </div>
  `).join('');
}

async function buscarAltaBaixaAtivos() {
  const symbols = ativos.map(a => a.simbolo).join(',');
  try {
    const url = `https://brapi.dev/api/quote/${symbols}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.results) {
      data.results.forEach(ativo => {
        const id = `bloco-${ativo.symbol.replace(/[^a-zA-Z0-9]/g, '')}`;
        const bloco = document.getElementById(id);
        if (bloco) {
          const alta = ativo.high;
          const baixa = ativo.low;
          const preco = ativo.regularMarketPrice;
          const variacao = ativo.regularMarketChangePercent;
          const moeda = ativo.currency || "BRL";
          bloco.querySelector('.valor-alta').textContent = alta ? alta.toLocaleString('pt-BR', { style: 'currency', currency: moeda }) : "---";
          bloco.querySelector('.valor-baixa').textContent = baixa ? baixa.toLocaleString('pt-BR', { style: 'currency', currency: moeda }) : "---";
          bloco.querySelector('.valor-atual').textContent = preco ? preco.toLocaleString('pt-BR', { style: 'currency', currency: moeda }) : "---";
          const variacaoSpan = bloco.querySelector('.variacao');
          if (typeof variacao === "number") {
            const texto = variacao.toFixed(2).replace('.', ',') + "%";
            variacaoSpan.textContent = (variacao > 0 ? '+' : '') + texto;
            variacaoSpan.classList.remove('positivo', 'negativo');
            variacaoSpan.classList.add(variacao >= 0 ? 'positivo' : 'negativo');
          } else {
            variacaoSpan.textContent = "---";
            variacaoSpan.classList.remove('positivo', 'negativo');
          }
        }
      });
    }
  } catch (e) {}
}

// NOTÍCIAS REAIS - NewsAPI E DEMAIS SITES
const NEWSAPI_KEY = '92221e88091bab959857e1a937a68fc9';

// Mapeamento de seções e categorias
const sections = [
  {id: 'news-principais',   query: {country: 'br', pageSize: 8},           category: null}, // Principais
  {id: 'news-politica',     query: {country: 'br', category: 'politics', pageSize: 6}, category: 'politics'},
  {id: 'news-economia',     query: {country: 'br', category: 'business', pageSize: 6}, category: 'business'},
  {id: 'news-mundo',        query: {country: 'us', pageSize: 6},           category: null},
  {id: 'news-tecnologia',   query: {country: 'br', category: 'technology', pageSize: 6}, category: 'technology'},
];

// Helper para montar URL da NewsAPI
function buildNewsAPIUrl(query) {
  let url = `https://newsapi.org/v2/top-headlines?apiKey=${NEWSAPI_KEY}`;
  if (query.country) url += `&country=${query.country}`;
  if (query.category) url += `&category=${query.category}`;
  if (query.pageSize) url += `&pageSize=${query.pageSize}`;
  return url;
}

async function carregarSecaoNoticias(sections) {
  for (const sec of sections) {
    const grid = document.getElementById(sec.id);
    if (!grid) continue;
    grid.innerHTML = `<div class="loading">Carregando notícias...</div>`;
    try {
      const url = buildNewsAPIUrl(sec.query);
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        grid.innerHTML = data.articles.map((noticia) => `
          <div class="news-card">
            ${noticia.urlToImage ? `<img class="news-image" src="${noticia.urlToImage}" alt="Imagem da notícia">` : `<div class="news-image" style="background:#ccc"></div>`}
            <div class="news-content">
              <div class="news-title">${noticia.title ? noticia.title : ""}</div>
              <div class="news-meta">
                ${noticia.publishedAt ? new Date(noticia.publishedAt).toLocaleDateString('pt-BR') : ""}
                ${noticia.author ? " &bull; " + noticia.author.replace(/[^\wÀ-ÿ0-9.,:;!?'"()\-–—/\s]/gi, "") : ""}
              </div>
              <div class="news-summary">${noticia.description ? noticia.description : ""}</div>
              <span class="news-source">Fonte: ${noticia.source && noticia.source.name ? noticia.source.name : "Desconhecida"}</span>
              <a class="news-link" href="${noticia.url}" target="_blank" rel="noopener">Ler completa</a>
            </div>
          </div>
        `).join('');
      } else {
        grid.innerHTML = `<p style='color:#c00'>Nenhuma notícia encontrada no momento.</p>`;
      }
    } catch (e) {
      grid.innerHTML = `<p style='color:#c00'>Erro ao carregar notícias.</p>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  criarLinhaAltaBaixaAtivos();
  buscarAltaBaixaAtivos();
  carregarSecaoNoticias(sections);
});
