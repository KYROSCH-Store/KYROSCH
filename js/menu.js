(() => {
  const panel = document.querySelector(".menu-mobile");
  const overlay = document.querySelector(".menu-overlay");
  const openBtn = document.querySelector(".mobile-menu-btn");
  const searchBtn = document.querySelector(".mobile-search-btn");
  const mobileSearch = document.querySelector(".mobile-search");
  const closeEls = document.querySelectorAll("[data-close]");
  const subBtns = document.querySelectorAll(".m-subbtn");

  if (!panel || !overlay || !openBtn) return;

  const lock = (on) => {
    document.documentElement.classList.toggle("no-scroll", on);
    document.body.classList.toggle("no-scroll", on);
  };

  const closeMenu = () => {
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    lock(false);

    // reset submenus y buscador para que no se buguee al 2do open
    subBtns.forEach(b => {
      b.setAttribute("aria-expanded", "false");
      const sub = b.nextElementSibling;
      if (sub && sub.classList.contains("m-sub")) {
        sub.classList.remove("is-open");
        sub.setAttribute("aria-hidden", "true");
      }
    });
    if (mobileSearch) {
      mobileSearch.classList.remove("is-open");
      mobileSearch.setAttribute("aria-hidden", "true");
    }
  };

  const openMenu = () => {
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
    lock(true);
  };

  openBtn.addEventListener("click", () => {
    panel.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  closeEls.forEach(el => el.addEventListener("click", closeMenu));

  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) closeMenu();
  });

  // submenus móviles
  subBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const sub = btn.nextElementSibling;
      if (!sub || !sub.classList.contains("m-sub")) return;

      const willOpen = btn.getAttribute("aria-expanded") !== "true";

      // cerrar otros
      subBtns.forEach(other => {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          const osub = other.nextElementSibling;
          if (osub && osub.classList.contains("m-sub")) {
            osub.classList.remove("is-open");
            osub.setAttribute("aria-hidden", "true");
          }
        }
      });

      btn.setAttribute("aria-expanded", String(willOpen));
      sub.classList.toggle("is-open", willOpen);
      sub.setAttribute("aria-hidden", String(!willOpen));
    });
  });

  // buscador móvil
  if (searchBtn && mobileSearch) {
    searchBtn.addEventListener("click", () => {
      const show = !mobileSearch.classList.contains("is-open");
      mobileSearch.classList.toggle("is-open", show);
      mobileSearch.setAttribute("aria-hidden", String(!show));
      if (show) {
        const input = mobileSearch.querySelector("input");
        if (input) input.focus();
      }
    });
  }

  // al pasar a desktop, cerrar
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 769 && panel.classList.contains("is-open")) closeMenu();
  });
})();