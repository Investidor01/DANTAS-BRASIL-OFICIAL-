// script.js
// Mostra informações completas de múltiplos ativos: preço atual, variação, alta, baixa

// Edite esta lista para os ativos que quiser mostrar
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
      <span class="preco-atual">💲 <span class="valor-atual">---</span></span>
      <span>
        <span class="alta">🔺 <span class="valor-alta">---</span></span>
        <span class="baixa" style="margin-left: 1em;">🔻 <span class="valor-baixa">---</span></span>
      </span>
      <span>
        Variação: <span class="variacao">---</span>
      </span>
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

          // Atualiza alta e baixa
          bloco.querySelector('.valor-alta').textContent = alta ? alta.toLocaleString('pt-BR', { style: 'currency', currency: moeda }) : "---";
          bloco.querySelector('.valor-baixa').textContent = baixa ? baixa.toLocaleString('pt-BR', { style: 'currency', currency: moeda }) : "---";
          bloco.querySelector('.valor-atual').textContent = preco ? preco.toLocaleString('pt-BR', { style: 'currency', currency: moeda }) : "---";
          // Variação percentual com cor
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
  } catch (e) {
    console.error("Erro ao buscar dados dos ativos:", e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  criarLinhaAltaBaixaAtivos();
  buscarAltaBaixaAtivos();
});
