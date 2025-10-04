


      (function () {
        // Ajuste dinâmico da altura do nav para evitar overflow da viewport em várias telas
        const nav = document.querySelector("nav[aria-label]");
        const header = document.querySelector('header[role="banner"]');
        const subHeader = document.querySelector(".sub-header");

        function setNavMaxHeight() {
          if (!nav || !header || !subHeader) return;
          const h =
            window.innerHeight -
            header.offsetHeight -
            subHeader.offsetHeight -
            48; // margem extra
          nav.style.maxHeight = (h > 200 ? h : 200) + "px";
        }
        setNavMaxHeight();
        window.addEventListener("resize", setNavMaxHeight);

        // comportamento: só 1 submenu aberto; Escape fecha; ArrowDown abre e foca primeiro item
        const menuButtons = Array.from(
          document.querySelectorAll("nav .menu-btn[aria-controls]")
        );
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
          btn.addEventListener("click", (e) => {
            const isExpanded = btn.getAttribute("aria-expanded") === "true";
            closeAllExcept(btn);
            // toggle clicked
            btn.setAttribute("aria-expanded", String(!isExpanded));
            const ctrl = btn.getAttribute("aria-controls");
            if (ctrl) {
              const el = document.getElementById(ctrl);
              if (el) el.setAttribute("aria-hidden", String(isExpanded));
              // scroll submenu into view inside nav (so it becomes visible when expanded)
              if (!isExpanded) {
                setTimeout(() => {
                  // prefer scrollIntoView on the submenu so nav's internal scroll shows it
                  el &&
                    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }, 120);
              }
            }
          });

          btn.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              btn.setAttribute("aria-expanded", "false");
              const ctrl = btn.getAttribute("aria-controls");
              if (ctrl) {
                const el = document.getElementById(ctrl);
                if (el) el.setAttribute("aria-hidden", "true");
              }
              btn.focus();
            }
            if (
              (e.key === "ArrowDown" || e.key === "Down") &&
              btn.getAttribute("aria-expanded") === "false"
            ) {
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

        // Close open submenu when clicking outside nav
        document.addEventListener("click", (e) => {
          if (!e.target.closest("nav")) {
            closeAllExcept(null);
          }
        });

        // Menu direito toggle
        const toggleBtn = document.getElementById("toggleMenu");
        const menuDireito = document.getElementById("menuDireito");
        toggleBtn.addEventListener("click", () => {
          const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
          toggleBtn.setAttribute("aria-expanded", String(!expanded));
          menuDireito.setAttribute("aria-hidden", String(expanded));
          toggleBtn.innerHTML = expanded ? `<i class="ph ph-caret-circle-left"></i>` : `<i class="ph ph-x-circle"></i>`;
        });

        // Skip link focus behavior
        const conteudo = document.getElementById("conteudo");
        const skip = document.querySelector(".skip-link");
        skip &&
          skip.addEventListener("click", () => {
            setTimeout(() => conteudo && conteudo.focus(), 50);
          });

        // small perf: recalc nav height after fonts/render
        window.addEventListener("load", () => setTimeout(setNavMaxHeight, 120));
      })();
    