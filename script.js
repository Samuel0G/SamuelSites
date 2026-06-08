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
  ".section, .contact, .price-card, .benefit-card, .project-card, .service-card, .media-card, .workflow-card, .about-skill-card, .feature-list article, .faq-list details"
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
const scrollTop = document.querySelector(".scroll-top");

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
      window.setTimeout(typeTitle, 22);
    } else {
      title.classList.remove("is-typing");
      title.classList.add("typing-done");
    }
  };

  window.setTimeout(typeTitle, 80);
}

if (scrollTop) {
  let scrollTicking = false;

  const toggleScrollTop = () => {
    scrollTop.classList.toggle("is-visible", window.scrollY > 420);
    scrollTicking = false;
  };

  toggleScrollTop();

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(toggleScrollTop);
        scrollTicking = true;
      }
    },
    { passive: true }
  );
}
