const apiKey = "92221e88091bab959857e1a937a68fc9";
const noticiasContainer = document.getElementById("noticias-container");

async function carregarNoticias() {
  try {
    const resposta = await fetch(`https://gnews.io/api/v4/top-headlines?lang=pt&country=br&max=6&apikey=${apiKey}`);
    const dados = await resposta.json();
    noticiasContainer.innerHTML = "";

    dados.articles.forEach((noticia) => {
      const div = document.createElement("div");
      div.className = "noticia";
      div.innerHTML = `
        <h2>${noticia.title}</h2>
        <p>${noticia.description || ""}</p>
        <a href="${noticia.url}" target="_blank">Leia mais</a>
        <hr />
      `;
      noticiasContainer.appendChild(div);
    });
  } catch (erro) {
    noticiasContainer.innerHTML = "Erro ao carregar notícias.";
  }
}

document.addEventListener("DOMContentLoaded", carregarNoticias);