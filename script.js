const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");

toggle?.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

menu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menu.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});
