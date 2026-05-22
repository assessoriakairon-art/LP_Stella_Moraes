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

// =========================
// CARROSSEL DE AVALIAÇÕES (GOOGLE)
// =========================
(function initReviewsCarousel() {
  const carousel = document.querySelector("[data-reviews-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector(".reviews-track");
  const prevBtn = carousel.querySelector("[data-reviews-prev]");
  const nextBtn = carousel.querySelector("[data-reviews-next]");
  if (!track) return;

  const AUTOPLAY_INTERVAL = 4500;
  let autoplayTimer = null;
  let isPaused = false;

  function getStep() {
    const firstCard = track.querySelector(".review-card");
    if (!firstCard) return track.clientWidth;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function maxScroll() {
    return track.scrollWidth - track.clientWidth;
  }

  function scrollByStep(direction) {
    const step = getStep();
    const target = track.scrollLeft + direction * step;
    const limit = maxScroll();

    if (direction > 0 && target >= limit - 1) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && target <= 0) {
      track.scrollTo({ left: limit, behavior: "smooth" });
    } else {
      track.scrollTo({ left: target, behavior: "smooth" });
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (!isPaused) scrollByStep(1);
    }, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      scrollByStep(-1);
      stopAutoplay();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      scrollByStep(1);
      stopAutoplay();
      startAutoplay();
    });
  }

  carousel.addEventListener("mouseenter", () => { isPaused = true; });
  carousel.addEventListener("mouseleave", () => { isPaused = false; });
  carousel.addEventListener("focusin", () => { isPaused = true; });
  carousel.addEventListener("focusout", () => { isPaused = false; });

  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  track.addEventListener("pointerdown", (event) => {
    isDown = true;
    moved = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.setPointerCapture(event.pointerId);
    track.style.scrollBehavior = "auto";
    isPaused = true;
  });

  track.addEventListener("pointermove", (event) => {
    if (!isDown) return;
    const dx = event.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
  });

  function endDrag(event) {
    if (!isDown) return;
    isDown = false;
    track.style.scrollBehavior = "";
    if (event && event.pointerId !== undefined) {
      try { track.releasePointerCapture(event.pointerId); } catch (_) {}
    }
    setTimeout(() => { isPaused = false; }, 600);
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("pointerleave", endDrag);

  track.addEventListener("click", (event) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    startAutoplay();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else if (!prefersReducedMotion) startAutoplay();
  });
})();
