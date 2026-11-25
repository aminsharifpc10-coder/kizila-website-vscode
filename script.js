// 1. Header turns solid after you scroll a little
const header = document.getElementById("top");
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
const msg = document.getElementById("openNow");
if (openDay && hour >= 9 && hour < 17) msg.textContent = "Open now, until 5 pm.";
else if (openDay) msg.textContent = "Open Monday to Thursday, 9 am to 5 pm.";
else msg.textContent = "Today by prior appointment. Call or message to book.";

// 4. Current year in the footer
document.getElementById("yr").textContent = now.getFullYear();
