const GNEWS_KEY = "92221e88091bab959857e1a937a68fc9";
const YOUTUBE_KEY = "AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A";
const WEATHER_KEY = "d2dbc9154fae0daaf42b27c046652291";

document.getElementById("hamburger").onclick = () => {
  const menu = document.getElementById("nav-menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

window.onscroll = () => {
  const btn = document.getElementById("back-to-top");
  btn.style.display = window.scrollY > 100 ? "block" : "none";
};

document.getElementById("back-to-top").onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Funções para carregar dados de APIs
async function fetchNews(section, query = "") {
  const res = await fetch(`https://gnews.io/api/v4/top-headlines?token=${GNEWS_KEY}&lang=pt&q=${query}`);
  const data = await res.json();
  const container = document.getElementById(section);
  if (data.articles) {
    container.innerHTML = data.articles.map(a =>
      `<div class="article"><h3>${a.title}</h3><p>${a.description}</p><small>Fonte: Dantas Brasil</small></div>`
    ).join("");
  }
}

async function fetchVideos() {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=notícias&key=${YOUTUBE_KEY}&maxResults=4`);
  const data = await res.json();
  const container = document.getElementById("videos-container");
  container.innerHTML = data.items.map(v =>
    `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${v.id.videoId}" frameborder="0" allowfullscreen></iframe>`
  ).join("");
}

async function fetchWeather() {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Rio de Janeiro&units=metric&lang=pt&appid=${WEATHER_KEY}`);
  const w = await res.json();
  document.getElementById("clima-container").innerHTML = `<p>${w.name}: ${w.main.temp}°C, ${w.weather[0].description}</p>`;
}

async function init() {
  await fetchNews("manchetes-container", "destaque");
  await fetchNews("urgentes-container", "urgente");
  await fetchNews("politica-container", "política");
  await fetchNews("economia-container", "economia");
  await fetchNews("esportes-container", "esportes");
  await fetchVideos();
  await fetchWeather();
  document.getElementById("dantas-container").innerHTML = "<p>Últimas matérias assinadas por Dantas Brasil atualizadas automaticamente.</p>";
}

window.onload = init;