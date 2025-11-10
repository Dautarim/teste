// Torna o primeiro campo focado automaticamente quando acessível
window.addEventListener("load", () => {
    document.getElementById("usuario").focus();
});

// Redireciona ao portal após clicar em "Entrar"
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) { form.addEventListener("submit", (e) => {
      e.preventDefault(); // evita o envio real do formulário
      window.location.href = "../portal/index.html"; // redireciona
    });
  }
});