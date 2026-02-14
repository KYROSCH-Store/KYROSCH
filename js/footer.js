
    const footer = document.querySelector(".footer-kyrosch");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
         footer.classList.add("visible");
        }
    });
}, { threshold: 0.3 });

observer.observe(footer);
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".footer-kyrosch");

  if (!footer) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        footer.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  observer.observe(footer);
});