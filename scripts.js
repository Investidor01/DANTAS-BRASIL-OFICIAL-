const GNEWS_KEY = "92221e88091bab959857e1a937a68fc9";
const YOUTUBE_KEY = "AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A";
const WEATHER_KEY = "d2dbc9154fae0daaf42b27c046652291";

document.getElementById("menu-toggle").onclick = () => {
  const nav = document.getElementById("nav");
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
};

document.getElementById("topBtn").onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

async function fetchNews(sectionId, topic) {
  const res = await fetch(`https://gnews.io/api/v4/search?q=${topic}&lang=pt&token=${GNEWS_KEY}`);
  const data = await res.json();
  const container = document.getElementById(sectionId);
  if (data.articles) {
    container.innerHTML = data.articles.map(a => `
      <div class="article">
        <h3>${a.title}</h3>
        <p>${a.description || ""}</p>
        <small>Fonte: Dantas Brasil</small>
      </div>
    `).join("");
  }
}

async function fetchUrgentTicker() {
  const res = await fetch(`https://gnews.io/api/v4/top-headlines?lang=pt&token=${GNEWS_KEY}`);
  const data = await res.json();
  const ticker = document.getElementById("ticker");
  if (data.articles) {
    ticker.innerText = data.articles.map(a => a.title).join(" • ");
  }
}

async function fetchVideos() {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=notícias&maxResults=4&key=${YOUTUBE_KEY}`);
  const data = await res.json();
  const container = document.getElementById("videos-container");
  container.innerHTML = data.items.map(v => `
    <iframe width="100%" height="200" src="https://www.youtube.com/embed/${v.id.videoId}" frameborder="0" allowfullscreen></iframe>
  `).join("");
}

async function fetchWeather() {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Rio de Janeiro&units=metric&lang=pt&appid=${WEATHER_KEY}`);
  const w = await res.json();
  document.getElementById("clima-container").innerHTML = `
    <div><strong>${w.name}</strong>: ${w.main.temp}°C - ${w.weather[0].description}</div>
  `;
}

async function init() {
  await fetchNews("manchetes-container", "manchetes");
  await fetchNews("urgentes-container", "urgente");
  await fetchNews("politica-container", "política");
  await fetchNews("economia-container", "economia");
  await fetchNews("esportes-container", "esportes");
  await fetchUrgentTicker();
  await fetchVideos();
  await fetchWeather();
  document.getElementById("dantas-container").innerHTML = "<p>Matérias exclusivas de Dantas Brasil serão exibidas aqui.</p>";
}

window.onload = init;