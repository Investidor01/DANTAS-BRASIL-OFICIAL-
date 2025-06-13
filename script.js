// ---- MENU LATERAL (hamburguer) ----
document.getElementById('menu-toggle-cnn')?.addEventListener('click', function() {
  document.getElementById('side-menu-cnn').classList.add('open');
  document.getElementById('menu-backdrop-cnn').classList.add('open');
});
document.getElementById('menu-close-cnn')?.addEventListener('click', function() {
  document.getElementById('side-menu-cnn').classList.remove('open');
  document.getElementById('menu-backdrop-cnn').classList.remove('open');
});
document.getElementById('menu-backdrop-cnn')?.addEventListener('click', function() {
  document.getElementById('side-menu-cnn').classList.remove('open');
  document.getElementById('menu-backdrop-cnn').classList.remove('open');
});
document.querySelectorAll('.side-menu-list-cnn a').forEach(link => {
  link.addEventListener('click', function() {
    document.getElementById('side-menu-cnn').classList.remove('open');
    document.getElementById('menu-backdrop-cnn').classList.remove('open');
  });
});

// ---- CARROSSEL ----
(function(){
  let slides = document.querySelectorAll("#banner-carrossel .banner-slide");
  let dots = document.querySelectorAll("#banner-dots .banner-dot");
  let current = 0;
  function showSlide(idx) {
    slides.forEach((s,i)=>{s.classList.toggle("active", i===idx);});
    dots.forEach((d,i)=>{d.classList.toggle("active", i===idx);});
    current = idx;
  }
  function nextSlide() { showSlide((current+1) % slides.length); }
  function prevSlide() { showSlide((current-1+slides.length) % slides.length); }
  document.getElementById("banner-next").onclick = nextSlide;
  document.getElementById("banner-prev").onclick = prevSlide;
  dots.forEach((dot,i)=>dot.onclick=()=>showSlide(i));
  setInterval(nextSlide, 7000);
  showSlide(0);
})();

// ---- SCROLL, LOADER, TOPO ----
window.onscroll = function() {
  var h = document.documentElement, s = h.scrollTop || document.body.scrollTop, sh = h.scrollHeight-h.clientHeight;
  document.getElementById("progressBar").style.width = (s/sh*100)+"%";
  document.getElementById("topBtn").style.display = window.scrollY > 300 ? "block" : "none";
};
document.getElementById("topBtn").onclick = function() {
  window.scrollTo({top:0, behavior:'smooth'});
};
document.getElementById('updateTime').innerText = new Date().toLocaleString('pt-BR');
fetch('https://api.countapi.xyz/hit/info-dantas-brasil/online').then(r=>r.json()).then(d=>{
  document.getElementById('onlineCount').innerText = d.value || '1';
});
setTimeout(function(){
  if(document.getElementById('loader')) document.getElementById('loader').style.display = 'none';
}, 10000);

// ---- NOTÍCIAS / FEEDS / DESTAQUES ----
const categorias = {
  politica: ["política","governo","presidente","congresso","senado","câmara"],
  internacional: ["internacional","exterior","onu","eua","china","rússia","mundo"],
  nacional: ["nacional","brasil","região","estadual","municipal"],
  esportes: ["esporte","esportes","futebol","copa","olimpíada","campeonato"],
  economia: ["economia","inflação","dólar","mercado","bolsa","banco central"],
  money: ["money","finanças","investimento","bolsa","ações","bancos"],
  entretenimento: ["entretenimento","cinema","filme","tv","novela","famosos","celebridade","série"],
  saude: ["saúde","covid","hospitais","médico","vacina"],
  tecnologia: ["tecnologia","tech","app","aplicativo","celular","internet","software"],
  lifestyle: ["lifestyle","moda","comportamento","beleza","tendência"],
  viagem: ["viagem","turismo","gastronomia","hotel","restaurante"],
  auto: ["auto","carro","veículo","moto","automóvel","transporte"],
  educacao: ["educação","escola","universidade","vestibular","enem"],
  colunas: ["coluna","opinião","artigo","editorial"],
  programacao: ["programação","código","dev","desenvolvedor","software"],
  equipe: ["equipe idb","sobre","quem somos","redação"],
  newsletters: ["newsletter","boletim"]
};
const feedUrls = [
  "https://rss2json.com/api.json?rss_url=https://g1.globo.com/rss/g1/",
  "https://rss2json.com/api.json?rss_url=https://g1.globo.com/economia/rss/g1/economia/",
  "https://rss2json.com/api.json?rss_url=https://g1.globo.com/rss/g1/tecnologia/",
  "https://rss2json.com/api.json?rss_url=https://g1.globo.com/rss/g1/esportes/",
  "https://rss2json.com/api.json?rss_url=https://g1.globo.com/rss/g1/politica/",
  "https://rss2json.com/api.json?rss_url=https://www.cnnbrasil.com.br/feed/",
  "https://rss2json.com/api.json?rss_url=https://feeds.folha.uol.com.br/cotidiano/rss091.xml",
  "https://rss2json.com/api.json?rss_url=https://feeds.folha.uol.com.br/mundo/rss091.xml",
  "https://rss2json.com/api.json?rss_url=https://rss.uol.com.br/feed/noticias.xml",
  "https://rss2json.com/api.json?rss_url=https://rss.uol.com.br/feed/economia.xml",
  "https://rss2json.com/api.json?rss_url=https://feeds.bbci.co.uk/portuguese/rss.xml",
  "https://rss2json.com/api.json?rss_url=https://feeds.bbci.co.uk/mundo/rss.xml",
  "https://rss2json.com/api.json?rss_url=https://rss.estadao.com.br/politica.xml",
  "https://rss2json.com/api.json?rss_url=https://rss.estadao.com.br/economia.xml",
  "https://rss2json.com/api.json?rss_url=https://rss.estadao.com.br/esportes.xml",
  "https://rss2json.com/api.json?rss_url=https://rss.estadao.com.br/internacional.xml",
  "https://rss2json.com/api.json?rss_url=https://oglobo.globo.com/rss/economia/",
  "https://rss2json.com/api.json?rss_url=https://oglobo.globo.com/rss/mundo/",
  "https://rss2json.com/api.json?rss_url=https://www.terra.com.br/rss/0,,EI1,00.xml",
  "https://rss2json.com/api.json?rss_url=https://exame.com/feed/",
  "https://rss2json.com/api.json?rss_url=https://valor.globo.com/rss/",
  "https://rss2json.com/api.json?rss_url=https://www.infomoney.com.br/feeds/rss/",
  "https://rss2json.com/api.json?rss_url=https://www.gazetaesportiva.com/rss/",
  "https://rss2json.com/api.json?rss_url=https://super.abril.com.br/feed/",
  "https://rss2json.com/api.json?rss_url=https://olhardigital.com.br/feed/",
  "https://rss2json.com/api.json?rss_url=https://www.tecmundo.com.br/rss"
];
const gnewsApiKey = "92221e88091bab959857e1a937a68fc9";
function filtraCategoria(titulo, desc, chapeu) {
  const texto = (titulo + " " + (desc||"") + " " + (chapeu||"")).toLowerCase();
  for (const cat in categorias) {
    if (categorias[cat].some(pal => texto.includes(pal))) return cat;
  }
  return null;
}
function noticiaHTML(item, cat) {
  let img = "";
  if(item.thumbnail) img = `<img class="noticia-img" src="${item.thumbnail}" alt="Thumb da notícia" style="height:70px;max-width:110px;object-fit:cover;border-radius:8px;">`;
  else if(item.enclosure && item.enclosure.link && item.enclosure.type && item.enclosure.type.startsWith("image"))
    img = `<img class="noticia-img" src="${item.enclosure.link}" alt="Thumb da notícia" style="height:70px;max-width:110px;object-fit:cover;border-radius:8px;">`;
  else if(item.enclosure && typeof item.enclosure === "string" && item.enclosure.match(/\.(jpg|jpeg|png|webp|gif)$/i))
    img = `<img class="noticia-img" src="${item.enclosure}" alt="Thumb da notícia" style="height:70px;max-width:110px;object-fit:cover;border-radius:8px;">`;
  let safeDesc = (item.description||"").replace(/<[^>]+>/g,'').slice(0,140);
  let badge = /urgente|ao vivo|breaking/i.test(item.title+item.description) ? '<span class="badge-urgente">URGENTE</span> ' : '';
  return `<li class="noticia">${img}
    <div class="noticia-content">
      <span class="noticia-chapeu">${cat.charAt(0).toUpperCase()+cat.slice(1)}</span>
      <span class="noticia-data">${item.pubDate ? new Date(item.pubDate).toLocaleDateString("pt-BR") : ""}</span>
      <h3>${badge}<a href="${item.link}" target="_blank" rel="noopener" style="color:#e30613;text-decoration:underline;">${item.title}</a></h3>
      <p>${safeDesc}...</p>
    </div>
  </li>`;
}
function isAoVivo(item) {
  const keywords = [
    "ao vivo","live","breaking news","urgente","em andamento","transmissão ao vivo"
  ];
  const campo = ((item.title||"") + " " + (item.description||"")).toLowerCase();
  return keywords.some(k => campo.includes(k));
}
function aovivoCard(item) {
  const yt = (item.link && item.link.includes("youtube.com/watch")) ? item.link.split("v=")[1]?.slice(0,11) : null;
  if(!yt) return '';
  let thumb = `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
  return `<div class="aovivo-card">
    <span class="aovivo-live">AO VIVO</span>
    <a href="https://www.youtube.com/watch?v=${yt}" target="_blank" title="Assistir ao vivo" rel="noopener">
      <img class="aovivo-thumb" src="${thumb}" alt="Thumb ao vivo">
    </a>
    <div class="aovivo-card-title">${item.title}</div>
  </div>`;
}

let noticiasPorCat = {};
function adicionaNoticiasPorCategoria() {
  let titulosSet = new Set();
  noticiasPorCat = {};
  for(const cat in categorias) noticiasPorCat[cat] = [];
  let aovivoArr = [];
  let manchetesArr = [];
  let feedsConcluidos=0, totalFeeds=feedUrls.length + 1;

  // GNEWS API
  fetch(`https://gnews.io/api/v4/top-headlines?token=${gnewsApiKey}&lang=pt&country=br&max=16`)
    .then(r=>r.json()).then(data=>{
      if(data.articles && data.articles.length) {
        data.articles.forEach(art=>{
          const cat = filtraCategoria(art.title, art.description, "");
          if(cat && !titulosSet.has(art.title)){
            titulosSet.add(art.title);
            noticiasPorCat[cat].push({
              title: art.title,
              description: art.description,
              link: art.url,
              thumbnail: art.image,
              pubDate: art.publishedAt
            });
            manchetesArr.push(art.title);
          }
        });
      }
    }).finally(()=>{
      feedsConcluidos++;
      if(feedsConcluidos===totalFeeds){
        renderizaNoticias(aovivoArr, manchetesArr);
      }
    });

  // RSS feeds
  feedUrls.forEach(url => {
    fetch(url).then(res=>res.json()).then(data=>{
      if(data && data.items && data.items.length){
        data.items.slice(0,8).forEach(item=>{
          const cat = filtraCategoria(item.title, item.description, item.categories && item.categories[0]);
          if(cat && !titulosSet.has(item.title)){
            titulosSet.add(item.title);
            noticiasPorCat[cat].push(item);
            manchetesArr.push(item.title);
          }
          if(isAoVivo(item)) {
            let card = aovivoCard(item);
            if(card) aovivoArr.push(card);
          }
        });
      }
    }).catch(()=>{}).finally(()=>{
      feedsConcluidos++;
      if(feedsConcluidos===totalFeeds){
        renderizaNoticias(aovivoArr, manchetesArr);
      }
    });
  });
}

function renderizaNoticias(aovivoArr, manchetesArr) {
  // Renderiza as notícias nas seções
  for(const cat in noticiasPorCat){
    const bloco = document.getElementById("noticias-"+cat);
    if(bloco)
      bloco.innerHTML = noticiasPorCat[cat].length ? noticiasPorCat[cat].map(item => noticiaHTML(item, cat)).join("") : "";
  }
  document.getElementById('aovivo-list').innerHTML = aovivoArr.length ? aovivoArr.join("") : "<div style='color:#e30613;font-size:1.1em'>Nenhuma transmissão ao vivo no momento.</div>";
  if(document.getElementById('loader')) document.getElementById('loader').style.display = 'none';
  // Atualiza barra urgente com as 4 primeiras manchetes
  const politics = noticiasPorCat.politica || [];
  const urgentUl = document.getElementById('marquee-urgente');
  if (politics.length > 0 && urgentUl) {
    let urgentNews = politics.slice(0,4).map(item => {
      let tmp = document.createElement('div');
      tmp.innerHTML = noticiaHTML(item, 'Política');
      let h3 = tmp.querySelector('h3');
      return h3?.innerText || 'Notícia';
    }).join(" • ");
    urgentUl.innerHTML = `<li style="display:inline;white-space:nowrap;padding-right:2em;">${urgentNews}</li>`;
    iniciarMarqueeUrgenteHorizontal();
  }
  window._onNoticiasCarregadas && window._onNoticiasCarregadas(manchetesArr.slice(0,8));
}

// Carrega notícias ao aparecer a seção
if('IntersectionObserver' in window){
  const obs = new IntersectionObserver((entries, observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        adicionaNoticiasPorCategoria();
        observer.disconnect();
      }
    });
  },{rootMargin:'200px'});
  obs.observe(document.getElementById('noticias-politica'));
}else{
  window.addEventListener('DOMContentLoaded',adicionaNoticiasPorCategoria);
}

// Fallback para UX caso não carregue nada
setTimeout(function(){
  [
    "politica","internacional","nacional","esportes","economia","money","entretenimento",
    "saude","tecnologia","lifestyle","viagem","auto","educacao","colunas","programacao","equipe","newsletters"
  ].forEach(function(cat){
    var bloco = document.getElementById("noticias-"+cat);
    if(bloco && bloco.innerHTML.trim() === "") {
      bloco.innerHTML = '<li class="noticia"><div class="noticia-content"><h3 style="color:#e30613">Nenhuma notícia disponível no momento. Tente novamente mais tarde.</h3></div></li>';
    }
  });
}, 12000);

// ---- DESTAQUES ----
function preencherDestaques(noticiasPorCat) {
  const destaquesLista = document.getElementById("destaques-lista");
  if (!destaquesLista) return;
  // Junta todas as notícias de todas categorias
  let todas = [];
  for (const cat in noticiasPorCat) {
    noticiasPorCat[cat].forEach(item => {
      let img = item.thumbnail || item.image || (item.enclosure && item.enclosure.link) || "";
      todas.push({
        title: item.title,
        description: item.description || "",
        link: item.link,
        image: img
      });
    });
  }
  // Remove duplicadas por título
  const vistos = new Set();
  todas = todas.filter(n => {
    if (vistos.has(n.title)) return false;
    vistos.add(n.title);
    return true;
  });
  // Prioriza urgentes ou com imagem
  let destaques = todas.filter(n => /urgente|breaking|ao vivo/i.test(n.title + n.description) && n.image)
    .concat(todas.filter(n => n.image && !/urgente|breaking|ao vivo/i.test(n.title + n.description)))
    .slice(0, 6);

  if (destaques.length < 6) {
    const extras = todas.filter(n => n.image && !destaques.includes(n));
    destaques = destaques.concat(extras.slice(0, 6 - destaques.length));
  }
  destaques = destaques.slice(0, 6);

  // Renderiza os cards
  destaquesLista.innerHTML = destaques.map(n =>
    `<div class="destaque-card">
      <img src="${n.image}" alt="${n.title}">
      <h3><a href="${n.link}" target="_blank" style="color:#e30613;text-decoration:none;">${n.title}</a></h3>
      <p>${(n.description || "").slice(0, 110)}...</p>
    </div>`
  ).join("");
}

// ---- VÍDEOS ----
function buscarVideosNoticiasAoVivo() {
  const apiKey = "AIzaSyBMakFQuTJwHYkaZ2t342UK4om3HsCtP8A";
  const videosGrid = document.getElementById('videos-grid');
  if(!videosGrid) return;
  videosGrid.innerHTML = '<div style="color:#e30613">Carregando vídeos...</div>';

  const pesquisaAoVivo = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&key=${apiKey}&maxResults=6&q=notícias OR news OR jornalismo OR breaking`;
  const pesquisaNoticiasRecentes = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${apiKey}&maxResults=6&order=date&q=notícias OR news OR jornalismo OR breaking`;

  Promise.all([
    fetch(pesquisaAoVivo).then(r=>r.json()),
    fetch(pesquisaNoticiasRecentes).then(r=>r.json())
  ]).then(([resAoVivo, resNoticias])=>{
    let videos = [];
    if(resAoVivo.items && resAoVivo.items.length) {
      videos = videos.concat(resAoVivo.items.map(video=>{
        let vid = video.id.videoId;
        let canal = video.snippet.channelTitle;
        return `<div class="video-relacionado destaque">
          <iframe src="https://www.youtube.com/embed/${vid}" loading="lazy" allowfullscreen title="Ao Vivo: ${canal}"></iframe>
          <span>AO VIVO: ${canal}</span>
        </div>`;
      }));
    }
    if(resNoticias.items && resNoticias.items.length) {
      videos = videos.concat(resNoticias.items.map(video=>{
        let vid = video.id.videoId;
        let canal = video.snippet.channelTitle;
        return `<div class="video-relacionado destaque">
          <iframe src="https://www.youtube.com/embed/${vid}" loading="lazy" allowfullscreen title="Notícias: ${canal}"></iframe>
          <span>Notícias: ${canal}</span>
        </div>`;
      }));
    }
    const seen = new Set();
    videos = videos.filter(v => {
      const match = v.match(/embed\/([a-zA-Z0-9_-]{11})/);
      if(!match) return false;
      const vid = match[1];
      if(seen.has(vid)) return false;
      seen.add(vid);
      return true;
    });

    if(videos.length) {
      videosGrid.innerHTML = videos.slice(0,8).join('');
    } else {
      videosGrid.innerHTML = '<div style="color:#e30613">Nenhum vídeo de notícia relevante encontrado no momento.</div>';
    }
  }).catch(()=>{
    videosGrid.innerHTML = '<div style="color:#e30613">Erro ao buscar vídeos de notícias no YouTube.</div>';
  });
}

window._onNoticiasCarregadas = function() {
  buscarVideosNoticiasAoVivo();
  preencherDestaques(noticiasPorCat);
};

// ---- MARQUEE URGENTE (Horizontal) ----
function iniciarMarqueeUrgenteHorizontal() {
  const marquee = document.getElementById('marquee-urgente');
  if (!marquee) return;
  marquee.parentElement.style.overflow = "hidden";
  marquee.style.display = "flex";
  marquee.style.flexDirection = "row";
  marquee.style.animation = "marqueeLeft 30s linear infinite";
  marquee.style.whiteSpace = "nowrap";
  marquee.style.position = "relative";
  if (!document.getElementById('marqueeLeftStyle')) {
    const style = document.createElement('style');
    style.id = 'marqueeLeftStyle';
    style.innerHTML = `
    @keyframes marqueeLeft {
      0% { transform: translateX(100%);}
      100% { transform: translateX(-100%);}
    }`;
    document.head.appendChild(style);
  }
    }
