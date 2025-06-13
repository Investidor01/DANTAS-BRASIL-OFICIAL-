// Chaves de API
const GNEWS = '92221e88091bab959857e1a937a68fc9';
const NEWSAPI = '92221e88091bab959857e1a937a68fc9';
const YOUTUBE = 'AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A';
const WEATHER = 'd2dbc9154fae0daaf42b27c046652291';

// Toggle menu
document.getElementById('hamburger').onclick = ()=> {
  const nav = document.getElementById('nav-menu');
  nav.style.display = nav.style.display==='flex'?'none':'flex';
};

// Scroll botão topo
const back = document.getElementById('back-to-top');
window.onscroll = () => {
  back.style.display = window.scrollY > 300 ? 'block' : 'none';
};
back.onclick = ()=> window.scrollTo({top:0, behavior:'smooth'});

// Função para carregar notícias
async function fetchNews(api, params) {
  const url = new URL(api);
  Object.entries(params).forEach(([k,v])=> url.searchParams.append(k,v));
  const res = await fetch(url); return res.json();
}

// Preenche seções genéricas
async function loadSection(elId, params, label) {
  const data = await fetchNews('https://gnews.io/api/v4/top-headlines', {token:GNEWS, ...params});
  const c = document.getElementById(elId);
  data.articles.slice(0,6).forEach(a=>{
    const d = document.createElement('div'); d.className = 'article';
    d.innerHTML = `<h3>${a.title}</h3><p>${a.description||''}</p><p><em>Dantas Brasil</em></p>`;
    c.appendChild(d);
  });
}

// Barra urgente
async function loadUrgentTicker() {
  const data = await fetchNews('https://gnews.io/api/v4/top-headlines', {token:GNEWS, lang:'pt'});
  const ticker = document.getElementById('urgent-ticker');
  data.articles.slice(0,10).forEach(a=>{
    const s = document.createElement('span');
    s.textContent = a.title; ticker.appendChild(s);
  });
}

// Vídeos via YouTube
async function loadVideos() {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE}&part=snippet&type=video&q=not%C3%ADcias+brasil&order=date`);
  const data = await res.json();
  const vc = document.getElementById('videos-container');
  data.items.slice(0,4).forEach(i=>{
    vc.innerHTML += `<iframe src="https://www.youtube.com/embed/${i.id.videoId}" frameborder="0" allowfullscreen></iframe>`;
  });
}

// Clima
async function loadWeather() {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Rio de Janeiro,BR&units=metric&appid=${WEATHER}`);
  const w = await res.json();
  const c = document.getElementById('clima-container');
  c.innerHTML = `<p><strong>${w.name}</strong>: ${Math.round(w.main.temp)}°C, ${w.weather[0].description}</p>`;
}

// Inicia tudo
async function init() {
  loadUrgentTicker();
  await loadSection('manchetes-container', {lang:'pt'}, 'manchetes');
  await loadSection('urgent-container', {lang:'pt', topic:'breaking-news'}, 'urgentes');
  await loadSection('politica-container', {lang:'pt', topic:'politics'}, 'politica');
  await loadSection('economia-container', {lang:'pt', topic:'economy'}, 'economia');
  await loadSection('esportes-container', {lang:'pt', topic:'sports'}, 'esportes');
  loadVideos();
  loadWeather();
  document.getElementById('dantas-container').innerHTML = `<p>Última matéria por Dantas Brasil carregada em cada seção.</p>`;
}
window.onload = init;
      
