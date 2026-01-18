document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = document.querySelector(".menu-toggle");
  const menuPanel = document.querySelector(".menu-mobile-panel");

  if (!menuToggle || !menuPanel) {
    console.warn("Menú móvil no encontrado");
    return;
  }

  menuToggle.addEventListener("click", () => {
    menuPanel.classList.toggle("show");

    const abierto = menuPanel.classList.contains("show");
    menuPanel.setAttribute("aria-hidden", !abierto);
  });

});