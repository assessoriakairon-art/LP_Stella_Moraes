// =========================
// MENU MOBILE
// =========================
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.style.display === "block";
    mobileMenu.style.display = isOpen ? "none" : "block";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.classList.toggle("active", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.style.display = "none";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("active");
    });
  });
}

// =========================
// REVEAL ON SCROLL
// =========================
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px"
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

// =========================
// HEADER COM ESTADO AO ROLAR
// =========================
const header = document.querySelector(".site-header");
const heroTextBlock = document.querySelector(".hero-copy");
const heroSection = document.querySelector(".hero");

function getHeaderTriggerPoint() {
  if (heroTextBlock) {
    const rect = heroTextBlock.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    return Math.max(260, top + 140);
  }

  if (heroSection) {
    return Math.max(320, heroSection.offsetHeight * 0.45);
  }

  return 320;
}

function updateHeaderOnScroll() {
  if (!header) return;

  const triggerPoint = getHeaderTriggerPoint();

  if (window.scrollY >= triggerPoint) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

updateHeaderOnScroll();
window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
window.addEventListener("resize", updateHeaderOnScroll);



