// Menu lateral estilo CNN
const menuToggleCNN = document.getElementById('menu-toggle-cnn');
const menuCloseCNN = document.getElementById('menu-close-cnn');
const sideMenuCNN = document.getElementById('side-menu-cnn');
const menuBackdropCNN = document.getElementById('menu-backdrop-cnn');

function openMenuCNN() {
  sideMenuCNN.classList.add('open');
  menuBackdropCNN.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMenuCNN() {
  sideMenuCNN.classList.remove('open');
  menuBackdropCNN.classList.remove('active');
  document.body.style.overflow = '';
}
if (menuToggleCNN) menuToggleCNN.onclick = openMenuCNN;
if (menuCloseCNN) menuCloseCNN.onclick = closeMenuCNN;
if (menuBackdropCNN) menuBackdropCNN.onclick = closeMenuCNN;

// Google Login Integration
window.handleIDBGoogleLogin = (response) => {
  const data = parseJwt(response.credential);
  document.getElementById('idb-google-login-cnn').innerHTML =
    `<div style="display:flex;align-items:center;gap:0.5em;">
      <img src="${data.picture}" alt="${data.name}" style="width:28px;height:28px;border-radius:50%">
      <span style="color:#fff;font-weight:600;">${data.name}</span>
      <button onclick="logoutIDBGoogle()" style="margin-left:0.5em;background:#e30613;color:#fff;border:none;border-radius:1.1em;padding:0.2em 1em;cursor:pointer;">Sair</button>
    </div>`;
  window.userIDBGoogle = data;
};
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch(e) { return {}; }
}
window.logoutIDBGoogle = function() {
  window.userIDBGoogle = null;
  document.getElementById('idb-google-login-cnn').innerHTML = '';
  renderGoogleButton();
}
function renderGoogleButton() {
  if (!window.userIDBGoogle) {
    google.accounts.id.initialize({
      client_id: '871681144917-dptlmqik7kl1ulpnkrrgngk9q1dppa3b.apps.googleusercontent.com',
      callback: handleIDBGoogleLogin,
      auto_select: false
    });
    google.accounts.id.renderButton(
      document.getElementById('idb-google-login-cnn'),
      { theme: "outline", size: "medium", width: 200 }
    );
  }
}
window.onload = function() {
  renderGoogleButton();
};
