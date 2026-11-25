// 1. Header turns solid after you scroll a little
const header = document.getElementById("top");
const msg = document.getElementById("openNow");
addEventListener("scroll", () => header.classList.toggle("solid", scrollY > 40), { passive: true });

// 2. Sections fade in the first time they appear on screen
document.documentElement.classList.add("js");
const seen = new IntersectionObserver((items) => {
  items.forEach((item) => {
    if (item.isIntersecting) { item.target.classList.add("in"); seen.unobserve(item.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => seen.observe(el));

// 3. "Open today" message (Monday to Thursday, 9 am to 5 pm)
const now = new Date(), day = now.getDay(), hour = now.getHours();
const openDay = day >= 1 && day <= 4;
if (!msg) {} else if (openDay && hour >= 9 && hour < 17) msg.textContent = "Open now, until 5 pm.";
else if (openDay) msg.textContent = "Open Monday to Thursday, 9 am to 5 pm.";
else msg.textContent = "Today by prior appointment. Call or message to book.";

// 4. Current year in the footer
document.getElementById("yr").textContent = now.getFullYear();

// 5. Pointer and click animations (all skipped when "reduce motion" is on)
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Thin progress line at the top shows how far you have scrolled
  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.appendChild(bar);
  const setBar = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener("scroll", setBar, { passive: true });
  setBar();

  // A ring spreads out from every click or tap, like a ripple
  addEventListener("pointerdown", (e) => {
    const ring = document.createElement("span");
    ring.className = "ripple";
    ring.style.left = e.clientX + "px";
    ring.style.top = e.clientY + "px";
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 700);
  });

  // Mouse-only effects (not on phones)
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    // Soft glow that follows the mouse
    const glow = document.createElement("div");
    glow.className = "glow";
    document.body.appendChild(glow);
    let x = 0, y = 0, gx = 0, gy = 0;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; glow.classList.add("on"); });
    document.documentElement.addEventListener("mouseleave", () => glow.classList.remove("on"));
    (function follow() {
      gx += (x - gx) * 0.12; gy += (y - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      requestAnimationFrame(follow);
    })();

    // Buttons and quick boxes lean slightly toward the mouse
    document.querySelectorAll(".btn, .quick a").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });

    // Clinic photo tilts gently in 3D
    const box = document.querySelector(".pic"), photo = document.querySelector(".pic .main");
    if (box && photo) {
      box.addEventListener("pointermove", (e) => {
        const r = box.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        photo.style.transform = `perspective(800px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
      });
      box.addEventListener("pointerleave", () => { photo.style.transform = ""; });
    }
  }
}
