// script.js - INFO DANTAS BRASIL

const GNEWS_API_KEY = "92221e88091bab959857e1a937a68fc9";
const NEWSAPI_KEY = "92221e88091bab959857e1a937a68fc9"; // Caso vá usar também
const YOUTUBE_API_KEY = "AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A";

const RSS_FEEDS = [
  "https://g1.globo.com/rss/g1/", 
  "https://feeds.bbci.co.uk/portuguese/rss.xml"
];

const breakingList = document.getElementById("breaking-list");
const highlightContainer = document.getElementById("highlight-news");
const latestContainer = document.getElementById("latest-news");
const youtubeContainer = document.getElementById("youtube-videos");

// ========== FETCH GNEWS ==========
async function fetchGNews(query = "Brasil", max = 6) {
  const url = `https://gnews.io/api/v4/search?q=${query}&lang=pt&country=br&max=${max}&apikey=${GNEWS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.articles || [];
}

// ========== FETCH RSS ==========
async function fetchRSS(url) {
  const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
  const data = await res.json();
  const parser = new DOMParser();
  const xml = parser.parseFromString(data.contents, "text/xml");
  const items = [...xml.querySelectorAll("item")].slice(0, 5);
  return items.map(item => ({
    title: item.querySelector("title").textContent,
    link: item.querySelector("link").textContent
  }));
}

// ========== FETCH YOUTUBE ==========
async function fetchYouTubeVideos(query = "notícias Brasil", max = 4) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=${max}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items || [];
}

// ========== RENDERING FUNÇÕES ==========
function renderBreakingNews(articles) {
  articles.forEach(article => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${article.link || article.url}" target="_blank">${article.title}</a>`;
    breakingList.appendChild(li);
  });
}

function renderArticles(container, articles) {
  container.innerHTML = articles.map(article => `
    <div class="news-card">
      <img src="${article.image || 'placeholder.jpg'}" alt="${article.title}">
      <div>
        <h3>${article.title}</h3>
        <p>${article.description || ''}</p>
        <a href="${article.url}" target="_blank">Leia mais</a>
      </div>
    </div>
  `).join("");
}

function renderYouTube(videos) {
  youtubeContainer.innerHTML = videos.map(video => `
    <iframe width="300" height="200" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
  `).join("");
}

// ========== CARREGAR TUDO ==========
async function loadContent() {
  const [gnews, rss1, rss2, youtube] = await Promise.all([
    fetchGNews("Brasil"),
    fetchRSS(RSS_FEEDS[0]),
    fetchRSS(RSS_FEEDS[1]),
    fetchYouTubeVideos("últimas notícias Brasil")
  ]);

  renderBreakingNews([...rss1, ...rss2]);
  renderArticles(highlightContainer, gnews.slice(0, 3));
  renderArticles(latestContainer, gnews.slice(3, 6));
  renderYouTube(youtube);
}

loadContent();

// ========== DARK MODE ==========
const toggleTheme = document.getElementById("toggle-theme");
toggleTheme.addEventListener("click", () => {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
});
                 
