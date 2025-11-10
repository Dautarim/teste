// script.js - comportamentos acessíveis mínimos

// Menu sanduíche acessível
const btnMenu = document.getElementById("btnMenu");
const topMenu = document.querySelector(".top-menu");

if (btnMenu && topMenu) {
  btnMenu.addEventListener("click", () => {
    
    const expanded = btnMenu.getAttribute("aria-expanded") === "true";
    btnMenu.setAttribute("aria-expanded", String(!expanded));
    topMenu.classList.toggle("ativo");

    // feedback para leitores de tela
    const announcer = document.getElementById("liveAnnouncer");
    if (announcer) {
      announcer.textContent = expanded ? "Menu principal fechado" : "Menu principal aberto";
    }
  });
}

// small helper: announce to SR live region
function announce(text){
  const sr = document.getElementById('liveAnnouncer');
  if(!sr) return;
  sr.textContent = '';
  setTimeout(()=> sr.textContent = text, 50);
}

// simulate session timer (for demo)
(function(){
  let secs = 30;
  const el = document.getElementById('sessionTimer');
  if(!el) return;
  setInterval(()=>{
    secs = Math.max(0, secs-1);
    const mm = String(Math.floor(secs/60)).padStart(2,'0');
    const ss = String(secs%60).padStart(2,'0');
    el.textContent = `${mm}:${ss}`;
  }, 1000);
})();

// keyboard shortcuts: Alt+1 jump to content, Alt+2 to sidebar
document.addEventListener('keydown', (e)=>{
  if(e.altKey && e.key === '1'){
    const main = document.getElementById('main');
    main && (main.focus(), announce('Conteúdo principal selecionado'));
  }
  if(e.altKey && e.key === '2'){
    const sb = document.getElementById('sidebar');
    sb && (sb.focus(), announce('Painel do discente selecionado'));
  }
});

// quick "ver mais" in destaque (demo)
document.querySelectorAll('.destaque .btn.small').forEach(btn=>{
  btn.addEventListener('click', (ev)=>{
    const a = ev.currentTarget.getAttribute('data-action');
    announce(`Você clicou em ${a}`);
    alert('Ação de demonstração: ' + a);
  });
});

// forum row focus: allow Enter to open link
document.querySelectorAll('.forum-table tbody tr').forEach(row=>{
  row.tabIndex = 0;
  row.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' ') {
      const link = row.querySelector('a');
      if(link) link.click();
    }
  });
});




