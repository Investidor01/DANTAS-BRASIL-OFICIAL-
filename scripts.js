document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("news-container");
  fetch("https://gnews.io/api/v4/top-headlines?lang=pt&country=br&token=92221e88091bab959857e1a937a68fc9")
    .then(res => res.json())
    .then(data => {
      container.innerHTML = data.articles.map(article => \`
        <article>
          <h3>\${article.title}</h3>
          <p>\${article.description}</p>
          <a href="\${article.url}" target="_blank">Leia mais</a>
        </article>
      \`).join("");
    })
    .catch(err => {
      container.innerHTML = "Erro ao carregar notícias.";
      console.error(err);
    });
});