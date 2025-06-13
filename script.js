// Notícias por seção
const noticias = {
  politica: [
    {
      imagem: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
      titulo: "Morre Elyanna Caldas, pianista e membro da Academia Pernambucana de Letras",
      resumo: "Musicista ocupava a cadeira de número 14 da APL e foi uma das fundadoras do curso de música da UFPE.",
      data: "13/06/2025"
    },
    {
      imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      titulo: "Crise no INSS impacta recuperação da popularidade do governo, avalia Flávia Oliveira",
      resumo: "Segundo analistas, a situação do órgão traz impactos para a imagem governamental.",
      data: "13/06/2025"
    }
  ],
  internacional: [
    {
      imagem: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
      titulo: "G7 discute sanções adicionais à Rússia",
      resumo: "Líderes das maiores economias avaliam novas medidas frente ao conflito.",
      data: "13/06/2025"
    }
  ],
  economia: [
    {
      imagem: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=600&q=80",
      titulo: "Inflação desacelera em junho, aponta IBGE",
      resumo: "Índice oficial registra leve queda puxada por alimentação e energia.",
      data: "13/06/2025"
    }
  ],
  esportes: [
    {
      imagem: "https://images.unsplash.com/photo-1505843278953-481bfa0b0d1d?auto=format&fit=crop&w=600&q=80",
      titulo: "Brasil estreia com vitória na Copa América",
      resumo: "Seleção vence partida de abertura e anima torcida.",
      data: "13/06/2025"
    }
  ],
  tecnologia: [
    {
      imagem: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      titulo: "Startups brasileiras atraem investidores estrangeiros",
      resumo: "Ecossistema de inovação nacional segue em alta no exterior.",
      data: "13/06/2025"
    }
  ]
};

function preencherNoticias(secao, lista) {
  const ul = document.getElementById("noticias-" + secao);
  if (!ul) return;
  ul.innerHTML = lista.map(n => `
    <li class="noticia">
      <img class="noticia-img" src="${n.imagem}" alt="${n.titulo}">
      <div class="noticia-content">
        <span class="noticia-chapeu">${secao.charAt(0).toUpperCase() + secao.slice(1)}</span>
        <span class="noticia-data">${n.data}</span>
        <h3><a href="#">${n.titulo}</a></h3>
        <p>${n.resumo}</p>
      </div>
    </li>
  `).join('');
}

for (const secao in noticias) {
  preencherNoticias(secao, noticias[secao]);
}

// Vídeos ao vivo
const videos = [
  {
    titulo: "AO VIVO: Câmara dos Deputados discute reforma tributária",
    url: "https://www.youtube.com/embed/live_stream?channel=UC2vX8dU6T0TnXo9v6c8xvhw"
  },
  {
    titulo: "AO VIVO: Notícias Internacionais",
    url: "https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA"
  }
];

const videosGrid = document.getElementById("videos-grid");
videosGrid.innerHTML = videos.map(v => `
  <div class="video-relacionado">
    <iframe src="${v.url}" allowfullscreen frameborder="0"></iframe>
    <span>${v.titulo}</span>
  </div>
`).join('');

// Cards AO VIVO
const aovivo = [
  {
    imagem: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    titulo: "Plenário do Senado debate PEC dos Precatórios",
    live: true
  }
];

const aovivoList = document.getElementById("aovivo-list");
aovivoList.innerHTML = aovivo.map(l => `
  <div class="aovivo-card">
    <img class="aovivo-thumb" src="${l.imagem}" alt="${l.titulo}">
    ${l.live ? '<span class="aovivo-live">AO VIVO</span>' : ""}
    <div class="aovivo-card-title">${l.titulo}</div>
  </div>
`).join('');

// Menu lateral
document.getElementById('menu-toggle-cnn').onclick = ()=>document.getElementById('side-menu-cnn').classList.add('open');
document.getElementById('menu-close-cnn').onclick = ()=>document.getElementById('side-menu-cnn').classList.remove('open');
document.getElementById('menu-backdrop-cnn').onclick = ()=>document.getElementById('side-menu-cnn').classList.remove('open');

// Relógio e online
function updateTime() {
  const now = new Date(), pad=n=>n<10?'0'+n:n;
  document.getElementById('updateTime').textContent =
    pad(now.getDate())+'/'+pad(now.getMonth()+1)+'/'+now.getFullYear()+', '+
    pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds());
}
setInterval(updateTime,1000); updateTime();
document.getElementById('onlineCount').textContent = Math.floor(200+Math.random()*50);

// Loader
window.addEventListener('load',()=>setTimeout(()=>{document.getElementById('loader').style.display='none'},800));
// Scroll Top Button
const topBtn = document.getElementById('topBtn');
window.onscroll = function() {
  topBtn.style.display = window.scrollY > 250 ? 'block' : 'none';
  document.getElementById('progressBar').style.width = (window.scrollY/(document.body.scrollHeight-window.innerHeight))*100+'vw';
};
topBtn.onclick = ()=>window.scrollTo({top:0,behavior:'smooth'});
