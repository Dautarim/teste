// Garante foco inicial e controle de menus
window.addEventListener("DOMContentLoaded", () => {
  const principalLink = document.getElementById("link-principal");
  if (principalLink) principalLink.focus();

  // Submenus do menu esquerdo - apenas um aberto por vez
  document.querySelectorAll("nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll("nav button").forEach(b => {
        b.setAttribute("aria-expanded", "false");
        document.getElementById(b.getAttribute("aria-controls")).setAttribute("aria-hidden", "true");
      });
      btn.setAttribute("aria-expanded", !expanded);
      document.getElementById(btn.getAttribute("aria-controls")).setAttribute("aria-hidden", expanded ? "true" : "false");
    });
  });

  // Menu lateral direito
  const toggleBtn = document.getElementById("toggleMenu");
  const menuDireito = document.getElementById("menuDireito");
  toggleBtn.addEventListener("click", () => {
    const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", !expanded);
    menuDireito.setAttribute("aria-hidden", expanded);
    toggleBtn.textContent = expanded ? "Abrir Menu" : "Fechar Menu";
  });

  // Conteúdo dinâmico
  const conteudo = document.getElementById("conteudo");
  const initialContent = conteudo.innerHTML;

  const linkTarefas = document.getElementById("link-tarefas");
  if (linkTarefas) {
    linkTarefas.addEventListener("click", e => {
      e.preventDefault();
      conteudo.classList.add("fade-out");

      setTimeout(() => {
        conteudo.innerHTML = `
          <div class="card">
            <h3>Tarefas Disponíveis</h3>
            <ul>
              <li>📄 Enviar Relatório de Controle – até 10/10/2025</li>
              <li>📄 Revisar Exercício de Modelagem – até 15/10/2025</li>
            </ul>
            <a href="#" id="voltar-principal">⬅ Voltar</a>
          </div>`;
        conteudo.classList.remove("fade-out");
        conteudo.classList.add("fade-in");
        conteudo.focus();

        const voltarLink = document.getElementById("voltar-principal");
        if (voltarLink) {
          voltarLink.addEventListener("click", e2 => {
            e2.preventDefault();
            conteudo.classList.add("fade-out");
            setTimeout(() => {
              conteudo.innerHTML = initialContent;
              conteudo.classList.remove("fade-out");
              conteudo.classList.add("fade-in");
              conteudo.focus();
            }, 250);
          });
        }
      }, 200);
    });
  }
});
