/* ============================================================
   1. AMBIENT PARTICLE SYSTEM (background canvas)
============================================================ */
(function () {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles(n) {
    return Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.5 ? "#f9a8d4" : "#d4af37",
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = H + 10;
        p.x = Math.random() * W;
      }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", () => {
    resize();
    particles = createParticles(120);
  });
  resize();
  particles = createParticles(120);
  tick();
})();

/* ============================================================
   2. SCROLL REVEAL
============================================================ */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

/* ============================================================
   3. TYPEWRITER EFFECT
============================================================ */
(function () {
  const text =
    "Ayleen, no soy muy bueno diciendo estas cosas, pero te has vuelto alguien muy especial para mí. Gracias por llegar a mi vida. Te quiero mucho.🧡";
  const el = document.getElementById("tw-output");
  let i = 0;
  let started = false;

  function type() {
    if (i < text.length) {
      const ch = text[i];
      el.innerHTML += ch === "\n" ? "<br/>" : ch;
      i++;
      setTimeout(type, ch === "." ? 350 : ch === "," ? 220 : 60);
    }
  }

  // Start when the section is visible
  const tw = document.getElementById("typewriter-el");
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        setTimeout(type, 400);
        obs.disconnect();
      }
    },
    { threshold: 0.4 },
  );

  obs.observe(tw);
})();

/* ============================================================
   4. FLOATING HEARTS (canvas on modal open)
============================================================ */
(function () {
  const canvas = document.getElementById("heart-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let hearts = [];
  let running = false;
  let raf;

  function drawHeart(x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x,
      y - size * 0.3,
      x - size * 0.5,
      y - size * 0.5,
      x - size * 0.5,
      y - size * 0.25,
    );
    ctx.bezierCurveTo(
      x - size * 0.5,
      y - size * 0.7,
      x,
      y - size * 0.7,
      x,
      y - size * 0.45,
    );
    ctx.bezierCurveTo(
      x,
      y - size * 0.7,
      x + size * 0.5,
      y - size * 0.7,
      x + size * 0.5,
      y - size * 0.25,
    );
    ctx.bezierCurveTo(x + size * 0.5, y - size * 0.5, x, y - size * 0.3, x, y);
    ctx.fill();
    ctx.restore();
  }

  function spawnHearts() {
    const count = 30;
    const colors = ["#f9a8d4", "#ec4899", "#d4af37", "#a855f7", "#ffffff"];
    for (let i = 0; i < count; i++) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 40,
        size: Math.random() * 24 + 12,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -(Math.random() * 3 + 2.5),
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: (Math.random() - 0.5) * 0.08,
      });
    }
  }

  function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts = hearts.filter((h) => h.y > -60 && h.alpha > 0.02);
    hearts.forEach((h) => {
      h.x += h.vx;
      h.y += h.vy;
      h.alpha -= 0.006;
      drawHeart(h.x, h.y, h.size, h.color, Math.max(0, h.alpha));
    });
    if (running) raf = requestAnimationFrame(animateHearts);
    else if (!hearts.length) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window._startHearts = function () {
    if (!running) {
      running = true;
      spawnHearts();
      animateHearts();
      // Keep spawning for 3 bursts
      let burst = 0;
      const iv = setInterval(() => {
        burst++;
        spawnHearts();
        if (burst >= 2) clearInterval(iv);
      }, 800);
      // Stop after 5s
      setTimeout(() => {
        running = false;
      }, 5000);
    }
  };
})();

/* ============================================================
   5. MODAL LOGIC
============================================================ */
(function () {
  const loveBtn = document.getElementById("love-btn");
  const modal = document.getElementById("love-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  function openModal() {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    window._startHearts();
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  loveBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();
