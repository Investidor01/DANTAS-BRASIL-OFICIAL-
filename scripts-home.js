
// Clima usando OpenWeatherMap
const WEATHER_API_KEY = "d2dbc9154fae0daaf42b27c046652291";
fetch(`https://api.openweathermap.org/data/2.5/weather?q=Brasilia,br&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("weather").innerHTML =
      `<strong>Clima em Brasília:</strong> ${data.weather[0].description}, ${data.main.temp}°C`;
  });

// Notícias urgentes (placeholder)
document.getElementById("breaking-news").innerHTML =
  '<marquee>🚨 Governo anuncia novas medidas econômicas | Última Hora: aumento de casos de gripe no Sul | Enchentes afetam o Norte do país...</marquee>';

// Vídeos do YouTube
const YOUTUBE_API_KEY = "AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A";
const CHANNEL_ID = "UCn8zNIfYAQNdrFRrr8oibKw"; // CNN Brasil
fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=4`)
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("video-container");
    data.items.forEach(item => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      container.innerHTML += `
        <div style="margin-bottom:15px">
          <iframe width="100%" height="215" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
          <p>${title}</p>
        </div>
      `;
    });
  });
