
const container = document.getElementById("noticias-container");
async function carregarNoticias() {
  try {
    const res = await fetch("https://gnews.io/api/v4/top-headlines?lang=pt&country=br&topic=politics&apikey=92221e88091bab959857e1a937a68fc9");
    const dados = await res.json();
    container.innerHTML = "";
    dados.articles.forEach((noticia) => {
      const div = document.createElement("div");
      div.innerHTML = `<h3>${noticia.title}</h3><p>${noticia.description}</p><a href="${noticia.url}" target="_blank">Leia mais</a>`;
      container.appendChild(div);
    });
  } catch (e) {
    container.innerHTML = "Erro ao carregar notícias.";
  }
}
document.addEventListener("DOMContentLoaded", carregarNoticias);
