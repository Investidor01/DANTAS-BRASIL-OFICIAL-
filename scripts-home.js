// scripts-home.js

// 1. Clima (OpenWeather API)
const climaContainer = document.getElementById("clima");
const WEATHER_API_KEY = "d2dbc9154fae0daaf42b27c046652291";
const cidade = "Rio de Janeiro";

fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`
)
  .then((res) => res.json())
  .then((data) => {
    const icon = data.weather[0].icon;
    climaContainer.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Clima">
      <strong>${data.name}</strong>: ${data.main.temp.toFixed(1)}°C, ${data.weather[0].description}
    `;
  })
  .catch(() => {
    climaContainer.textContent = "Erro ao carregar clima.";
  });

// 2. Vídeos do YouTube
const youtubeContainer = document.getElementById("youtube-videos");
const YOUTUBE_API_KEY = "AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A";
const canalId = "UCW8jNmgCuD7pQZx4k4U5f7g"; // Exemplo: Jovem Pan News

fetch(
  `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${canalId}&part=snippet,id&order=date&maxResults=3`
)
  .then((res) => res.json())
  .then((data) => {
    youtubeContainer.innerHTML = data.items
      .map(
        (item) => `
      <div class="video">
        <iframe src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
        <h4>${item.snippet.title}</h4>
      </div>`
      )
      .join("");
  })
  .catch(() => {
    youtubeContainer.textContent = "Erro ao carregar vídeos.";
  });

// 3. Marquee Notícias Urgentes (Exemplo Estático)
const urgente = document.getElementById("noticias-urgentes");
urgente.innerHTML = `🚨 URGENTE: Governo anuncia novas medidas econômicas • Atenção: forte chuva atinge o RJ • Breaking: Estados Unidos reagem após ataque no Oriente Médio`;
