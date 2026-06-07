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

const revealItems = document.querySelectorAll(
  ".section, .contact, .price-card, .feature-list article, .faq-list details"
);

revealItems.forEach((item) => item.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const title = document.querySelector(".hero h1");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (title && !reduceMotion) {
  const text = title.textContent.trim();
  title.setAttribute("aria-label", text);
  title.textContent = "";
  title.classList.add("is-typing");

  let index = 0;
  const typeTitle = () => {
    title.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      window.setTimeout(typeTitle, 34);
    } else {
      title.classList.remove("is-typing");
      title.classList.add("typing-done");
    }
  };

  window.setTimeout(typeTitle, 260);
}
