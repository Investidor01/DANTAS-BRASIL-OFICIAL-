const GNEWS_API_KEY = "92221e88091bab959857e1a937a68fc9";
fetch(`https://gnews.io/api/v4/top-headlines?lang=pt&country=br&topic=sports&token=${GNEWS_API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const noticias = document.getElementById("noticias");
    data.articles.forEach(noticia => {
      const article = document.createElement("article");
      article.innerHTML = `
        <h2><a href="${noticia.url}" target="_blank">${noticia.title}</a></h2>
        <p>${noticia.description || ""}</p>
        <small>${new Date(noticia.publishedAt).toLocaleString("pt-BR")}</small>
        <hr />
      `;
      noticias.appendChild(article);
    });
  })
  .catch(() => {
    document.getElementById("noticias").innerText = "Erro ao carregar notícias.";
  });
