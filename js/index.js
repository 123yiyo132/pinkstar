// =========================
// ✨ PINK STAR - ANIMACIONES INDEX
// =========================

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Loader inicial (efecto entrada general)
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(10px)";

  setTimeout(() => {
    document.body.style.transition = "all 0.8s ease";
    document.body.style.opacity = "1";
    document.body.style.transform = "translateY(0)";
  }, 100);

  // 2. Animación HERO
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.opacity = "0";
    hero.style.transform = "scale(1.05)";

    setTimeout(() => {
      hero.style.transition = "1s ease";
      hero.style.opacity = "1";
      hero.style.transform = "scale(1)";
    }, 300);
  }

  // 3. Animación de títulos
  const titles = document.querySelectorAll(".section-title, h1, h2");

  titles.forEach((title, i) => {
    title.style.opacity = "0";
    title.style.transform = "translateY(20px)";

    setTimeout(() => {
      title.style.transition = "0.6s ease";
      title.style.opacity = "1";
      title.style.transform = "translateY(0)";
    }, 400 + i * 150);
  });

  // 4. Animación de CARDS (modo tienda pro)
  const cards = document.querySelectorAll(".product-card, .card");

  cards.forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px) scale(0.95)";

    setTimeout(() => {
      card.style.transition = "0.6s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0) scale(1)";
    }, 600 + i * 120);
  });

  // 5. Animación NAVBAR
  const nav = document.querySelector(".navbar");

  if (nav) {
    nav.style.transform = "translateY(-100%)";

    setTimeout(() => {
      nav.style.transition = "0.6s ease";
      nav.style.transform = "translateY(0)";
    }, 200);
  }

  // 6. Botones con efecto “pop”
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((btn, i) => {
    btn.style.opacity = "0";
    btn.style.transform = "scale(0.8)";

    setTimeout(() => {
      btn.style.transition = "0.4s ease";
      btn.style.opacity = "1";
      btn.style.transform = "scale(1)";
    }, 500 + i * 80);
  });

});