/* vtnsc.js */
(function () {
  // elementos principais
  const nav = document.querySelector("nav[aria-label]");
  const header = document.querySelector('header[role="banner"]');
  const subHeader = document.querySelector(".sub-header");
  const conteudo = document.getElementById("conteudo");
  const srAnnouncer = document.getElementById("sr-announcer");

  // guarda conteúdo inicial pra restaurar quando clicar "Principal"
  let initialContent = conteudo ? conteudo.innerHTML : "";

  // ajusta max-height do nav (dinâmico)
  function setNavMaxHeight() {
    if (!nav || !header || !subHeader) return;
    const h = window.innerHeight - header.offsetHeight - subHeader.offsetHeight - 48;
    nav.style.maxHeight = (h > 200 ? h : 200) + "px";
  }
  setNavMaxHeight();
  window.addEventListener("resize", setNavMaxHeight);
  window.addEventListener("load", () => setTimeout(setNavMaxHeight, 120));

  // menu comportamentos (só 1 submenu aberto)
  const menuButtons = Array.from(document.querySelectorAll("nav .menu-btn[aria-controls]"));
  function closeAllExcept(exceptBtn) {
    menuButtons.forEach((btn) => {
      if (btn !== exceptBtn) {
        btn.setAttribute("aria-expanded", "false");
        const ctrl = btn.getAttribute("aria-controls");
        if (ctrl) {
          const el = document.getElementById(ctrl);
          if (el) el.setAttribute("aria-hidden", "true");
        }
      }
    });
  }

  menuButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      closeAllExcept(btn);
      btn.setAttribute("aria-expanded", String(!isExpanded));
      const ctrl = btn.getAttribute("aria-controls");
      if (ctrl) {
        const el = document.getElementById(ctrl);
        if (el) {
          el.setAttribute("aria-hidden", String(isExpanded));
          if (!isExpanded) {
            // rola o submenu pra ficar visível dentro do nav
            setTimeout(()=> el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
          }
        }
      }
    });

    // keyboard helpers
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        btn.setAttribute("aria-expanded", "false");
        const ctrl = btn.getAttribute("aria-controls");
        if (ctrl) { const el = document.getElementById(ctrl); if (el) el.setAttribute("aria-hidden", "true"); }
        btn.focus();
      }
      if ((e.key === "ArrowDown" || e.key === "Down") && btn.getAttribute("aria-expanded") === "false") {
        e.preventDefault();
        btn.click();
        const ctrl = btn.getAttribute("aria-controls");
        const el = ctrl ? document.getElementById(ctrl) : null;
        if (el) {
          const firstLink = el.querySelector("a, button");
          if (firstLink) firstLink.focus();
        }
      }
    });
  });

  // fecha submenus ao clicar fora
  document.addEventListener("click", (e) => {
    if (!e.target.closest("nav")) closeAllExcept(null);
  });

  // menu direito toggle
  const toggleBtn = document.getElementById("toggleMenu");
  const menuDireito = document.getElementById("menuDireito");
  if (toggleBtn && menuDireito) {
    toggleBtn.addEventListener("click", () => {
      const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!expanded));
      menuDireito.setAttribute("aria-hidden", String(expanded));
      toggleBtn.innerHTML = expanded ? `<i class="ph ph-caret-circle-left"></i>` : `<i class="ph ph-x-circle"></i>`;
    });
  }

  // Skip link focus handling
  const skip = document.querySelector(".skip-link");
  if (skip && conteudo) {
    skip.addEventListener("click", () => {
      setTimeout(() => conteudo && conteudo.focus(), 50);
    });
  }

  // Focus inicial: colocar foco no "Principal" do menu (acessível)
  window.addEventListener("DOMContentLoaded", () => {
    const linkPrincipal = document.getElementById("link-principal");
    if (linkPrincipal) {
      // foco programático (não usar autofocus HTML)
      linkPrincipal.focus();
    }
  });

  // =========================
  // RESTAURAR CONTEÚDO (Principal)
  // =========================
  const linkPrincipal = document.getElementById("link-principal");
  if (linkPrincipal && conteudo) {
    linkPrincipal.addEventListener("click", (e) => {
      e.preventDefault();
      // fade out -> replace -> fade in
      conteudo.classList.add("fade-out");
      setTimeout(() => {
        conteudo.innerHTML = initialContent;
        conteudo.classList.remove("fade-out");
        conteudo.classList.add("fade-in");
        // re-establish focus and announce
        conteudo.setAttribute("aria-live", "polite");
        setTimeout(()=> {
          conteudo.focus();
          announceSR("Conteúdo Principal restaurado.");
          // remove fade-in after animation
          setTimeout(()=> conteudo.classList.remove("fade-in"), 300);
        }, 120);
      }, 160);
    });
  }

  // helper para anunciar ao SR
  function announceSR(text) {
    if (!srAnnouncer) return;
    srAnnouncer.textContent = '';
    // small delay to force announcement
    setTimeout(()=> { srAnnouncer.textContent = text; }, 50);
  }

  // =========================
  // TROCA DE CONTEÚDO: TAREFAS
  // =========================
  const linkTarefas = document.getElementById("link-tarefas");
  if (linkTarefas && conteudo) {
    linkTarefas.addEventListener("click", (e) => {
      e.preventDefault();

      // fade out
      conteudo.classList.add("fade-out");

      setTimeout(() => {
        // limpa
        conteudo.innerHTML = "";

        // titulo (focável)
        const titulo = document.createElement("h2");
        titulo.textContent = "Tarefas - Controle e Servomecanismo";
        titulo.tabIndex = -1;
        titulo.style.color = "var(--blue)";
        titulo.style.marginBottom = "1rem";
        conteudo.appendChild(titulo);

        // listas de tarefas (exemplo)
        const tarefas = [
          {
            nome: "Tarefa 1 - Diagrama de Blocos",
            descricao: "Monte o diagrama de blocos de um sistema de controle de posição utilizando realimentação unitária.",
          },
          {
            nome: "Tarefa 2 - Resposta ao Degrau",
            descricao: "Analise a resposta ao degrau de um sistema de segunda ordem e discuta o impacto da variação do fator de amortecimento.",
          },
          {
            nome: "Tarefa 3 - Projeto de Controlador PID",
            descricao: "Projete e simule um controlador PID para o sistema de controle de velocidade de um motor DC.",
          }
        ];

        tarefas.forEach((tarefa, i) => {
          const card = document.createElement("article");
          card.className = "tarefa-card";
          card.tabIndex = 0;
          card.innerHTML = `
            <div class="aula"><h3>${tarefa.nome}</h3></div>
            <p>${tarefa.descricao}</p>
            <div class="botoes-tarefa">
              <button type="button" class="btn-submeter" data-tarefa="${i}" aria-label="Submeter ${tarefa.nome}">
                <i class="ph-fill ph-check-circle" aria-hidden="true"></i> Submeter
              </button>
              <label class="btn-arquivo" for="arquivo-${i}">
                <i class="ph-fill ph-upload-simple" aria-hidden="true"></i> Enviar arquivo
              </label>
              <input type="file" id="arquivo-${i}" class="input-arquivo" aria-label="Escolher arquivo para ${tarefa.nome}" />
            </div>
          `;
          conteudo.appendChild(card);
        });

        // adiciona botão "Voltar" acessível (restaurar principal)
        const voltar = document.createElement("p");
        voltar.style.marginTop = "1rem";
        voltar.innerHTML = `<a href="#" id="voltar-principal" class="bot-alterar-vinculo">Voltar para Principal</a>`;
        conteudo.appendChild(voltar);

        // fade in
        conteudo.classList.remove("fade-out");
        conteudo.classList.add("fade-in");

        // foco e anuncio pra leitor de tela
        setTimeout(()=> {
          titulo.focus();
          announceSR("Tela de tarefas carregada. Três tarefas listadas.");
        }, 120);

        // attach handlers for submit and file inputs
        const submitButtons = Array.from(document.querySelectorAll(".btn-submeter"));
        submitButtons.forEach(btn => {
          btn.addEventListener("click", (ev) => {
            const idx = btn.getAttribute("data-tarefa");
            announceSR(`Tarefa ${Number(idx)+1} submetida (simulação).`);
            // feedback visual simples
            btn.textContent = "Enviado";
            btn.disabled = true;
            btn.style.opacity = ".8";
          });
        });

        const fileInputs = Array.from(document.querySelectorAll(".input-arquivo"));
        fileInputs.forEach(input => {
          input.addEventListener("change", (ev) => {
            const file = input.files && input.files[0];
            if (file) announceSR(`Arquivo ${file.name} selecionado para upload.`);
          });
        });

        // Voltar para principal
        const voltarLink = document.getElementById("voltar-principal");
        if (voltarLink) {
          voltarLink.addEventListener("click", (ev) => {
            ev.preventDefault();
            // restaurar via clique do link principal
            if (linkPrincipal) linkPrincipal.click();
          });
        }

        // limpa fade-in depois
        setTimeout(()=> conteudo.classList.remove("fade-in"), 500);
      }, 180);
    });
  }

})();
