document.addEventListener("DOMContentLoaded", () => {

  const NUMERO_WSP = "51965474751"; // TU WHATSAPP

  const botones = document.querySelectorAll(".blusas-btn");

  botones.forEach((btn) => {

    btn.addEventListener("click", function (e) {
      e.preventDefault();

      // Busca la tarjeta del producto
      const card = this.closest(".blusas-card");

      // Obtener datos automáticamente
      const nombre = card.querySelector("h3")?.innerText.trim();
      const precio = card.querySelector(".blusas-precio")?.innerText.trim();

      // Link actual (opcional pero PRO)
      const pagina = window.location.href;

      // Mensaje automático
      const mensaje =
        `Hola 👋 estoy interesado en:%0A` +
        `Producto: ${encodeURIComponent(nombre)}%0A` +
        `Precio: ${encodeURIComponent(precio)}%0A` +
        `¿Disponible en talla y color?%0A` +
        `Link: ${encodeURIComponent(pagina)}`;

      const url = `https://wa.me/${NUMERO_WSP}?text=${mensaje}`;

      window.open(url, "_blank");
    });

  });

});