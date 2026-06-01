/* ================================================================
   main.js — Portfolio Landing Page
   ================================================================

   TABLE OF CONTENTS
   -----------------
   1.  Year (footer)
   2.  Sidebar
   3.  Theme Toggle
   4.  Floating Particles (hero)
   5.  Projects — data & renderer
   6.  Scroll-Reveal (IntersectionObserver)
   7.  Scroll-Snap section tracker (sidebar active link)
   8.  3-D Star-field Canvas
   9.  Contact Form
================================================================ */


/* ================================================================
   1. YEAR — auto-updates copyright in footer
================================================================ */
const snapContainer = document.getElementById('snap-container');

document.getElementById('year').textContent = new Date().getFullYear();


/* ================================================================
   2. SIDEBAR
================================================================ */
const sidebarToggle   = document.getElementById('sidebar-toggle');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');

sidebarToggle.addEventListener('click', () => {
  document.body.classList.toggle('sidebar-open');
});

sidebarBackdrop.addEventListener('click', closeSidebar);

function closeSidebar() {
  document.body.classList.remove('sidebar-open');
}

// Close sidebar with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});

/* ================================================================
   ANCHOR SCROLL FIX
   Because body is the scroll container (not window), native
   anchor href="#id" jumps bypass scroll-snap. We intercept
   every internal link and use scrollIntoView instead.
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    // Scroll within #snap-container (the actual scroll host)
    snapContainer.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  });
});


/* ================================================================
   3. THEME TOGGLE
   HOW TO CHANGE DEFAULT THEME: edit data-theme="dark" on <html>
   in index.html (line 2) to data-theme="light".
================================================================ */
const root = document.documentElement;
const themeBtn = document.getElementById('theme-btn');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', savedTheme);

updateButton(savedTheme);

themeBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    updateButton(newTheme);
});

function updateButton(theme) {
    themeBtn.querySelector('.theme-label').textContent =
        theme === 'dark' ? 'Light Mode' : 'Dark Mode';

    themeBtn.querySelector('.theme-icon').textContent =
        theme === 'dark' ? '☀️' : '🌙';
}
/* ================================================================
   4. FLOATING PARTICLES (hero section)
   HOW TO TWEAK:
     COUNT  — total particles spawned
     size range (Math.random() * N + M) — dot diameter in px
     duration range (Math.random() * N + M) — seconds per cycle
================================================================ */
(function spawnParticles() {
  const container = document.getElementById('particles');
  const COUNT     = 32;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left             = Math.random() * 100 + '%';
    const size               = Math.random() * 5 + 2;
    p.style.width            = size + 'px';
    p.style.height           = size + 'px';
    p.style.animationDuration  = (Math.random() * 16 + 9) + 's';
    p.style.animationDelay     = -(Math.random() * 24) + 's';
    container.appendChild(p);
  }
})();


/* ================================================================
   5. PROJECTS DATA & RENDERER
   
   HOW TO ADD A PROJECT:
     Copy any object inside projectsData and paste it (with a
     trailing comma) before the closing bracket. Fields:
       emoji       — displayed in the card header (any emoji)
       title       — project name, rendered in Archivo Black
       description — 1–2 sentence summary
       tags        — string array, shown as colored pills
       link        — URL; use "#" as a placeholder
================================================================ */
const projectsData = [
  {
    emoji: "🛒",
    title: "E-Commerce Platform",
    description: "A full-stack shopping site with cart, checkout, and admin dashboard built with PHP and MySQL.",
    tags: ["PHP", "MySQL", "CSS", "JS"],
    link: "#"
  },
  {
    emoji: "📝",
    title: "Task Manager App",
    description: "Drag-and-drop kanban board with real-time updates, labels, and team collaboration features.",
    tags: ["JavaScript", "HTML", "CSS"],
    link: "#"
  },
  {
    emoji: "🌐",
    title: "Portfolio Website",
    description: "This very page — a responsive, themeable developer portfolio with 3-D scroll effects.",
    tags: ["HTML", "CSS", "JS"],
    link: "#"
  }
  /* ← ADD MORE PROJECTS HERE */
];

(function renderProjects() {
  const grid = document.getElementById('projects-grid');

  projectsData.forEach((p, i) => {
    const card = document.createElement('div');
    // Add reveal classes + stagger delay
    card.className = 'project-card reveal-pop';
    card.style.setProperty('--delay', (i * 0.1) + 's');

    card.innerHTML = `
      <div class="project-icon">${p.emoji}</div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.description}</div>
      <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <a class="project-link" href="${p.link}" target="_blank" rel="noopener">View Project →</a>
    `;
    grid.appendChild(card);
  });
})();


/* ================================================================
   6. SCROLL-REVEAL — IntersectionObserver
   
   Watches elements with .reveal-up / .reveal-left /
   .reveal-right / .reveal-pop classes, plus .section-title,
   .section-sub, .accent-line, .hero-logo.
   
   Staggered siblings: set --delay on each child in HTML or by
   JS (see renderProjects above and the lang-pill setup below).
   
   HOW TO ADD A NEW REVEAL ELEMENT:
     Give it one of the classes: reveal-up / reveal-left /
     reveal-right / reveal-pop. It will animate in automatically.
================================================================ */
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .reveal-pop, ' +
  '.section-title, .section-sub, .accent-line, .hero-logo, ' +
  '.lang-pill, .social-row-card'
);

// Stagger .lang-pill items
document.querySelectorAll('.lang-pill').forEach((el, i) => {
  el.style.setProperty('--delay', (i * 0.07) + 's');
});

// Stagger social cards
document.querySelectorAll('.social-row-card').forEach((el, i) => {
  el.style.setProperty('--delay', (i * 0.09) + 's');
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // play once
      }
    });
  },
  { threshold: 0.15, root: snapContainer }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ================================================================
   7. SECTION TRACKER — highlights active link in sidebar
   Uses IntersectionObserver on each section, highlights the
   matching <a> in the sidebar.
================================================================ */
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('#sidebar a[data-section]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(
          `#sidebar a[data-section="${entry.target.id}"]`
        );
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.5, root: snapContainer }
);

sections.forEach(s => sectionObserver.observe(s));


/* ================================================================
   8. 3-D STAR-FIELD CANVAS BACKGROUND
   
   A perspective tunnel of dots flies toward the viewer.
   Activates (fades in) after the first scroll event.
   
   HOW TO TWEAK:
     DOT_COUNT — more dots = denser field
     FOV       — larger = wider field of view / shallower depth
     SPEED     — dot approach speed (px per frame)
================================================================ */
const canvas    = document.getElementById('bg-canvas');
const ctx       = canvas.getContext('2d');
const DOT_COUNT = 220;
const FOV       = 320;
const SPEED     = 0.85;

let dots = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function initDots() {
  dots = Array.from({ length: DOT_COUNT }, () => ({
    x: (Math.random() - .5) * W * 2,
    y: (Math.random() - .5) * H * 2,
    z: Math.random() * FOV
  }));
}
initDots();

function getAccentColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || '#4e9fff';
}

function drawDots() {
  ctx.clearRect(0, 0, W, H);
  const accent = getAccentColor();

  dots.forEach(d => {
    d.z -= SPEED;
    if (d.z <= 0) {
      d.x = (Math.random() - .5) * W * 2;
      d.y = (Math.random() - .5) * H * 2;
      d.z = FOV;
    }
    const scale = FOV / (FOV + d.z);
    const sx = W / 2 + d.x * scale;
    const sy = H / 2 + d.y * scale;
    const r  = Math.max(.4, 2.8 * scale);

    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fillStyle  = accent;
    ctx.globalAlpha = scale * .5;
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawDots);
}
drawDots();

// Reveal canvas after first scroll inside #snap-container
function activateBg() {
  document.body.classList.add('scrolled');
  snapContainer.removeEventListener('scroll', activateBg);
}
snapContainer.addEventListener('scroll', activateBg, { passive: true });


/* ================================================================
   9. CONTACT FORM
   
   HOW TO INTEGRATE A REAL BACKEND:
     Replace the success block inside sendMessage() with a
     fetch() POST to your API endpoint or EmailJS call.
================================================================ */
function sendMessage() {
  const nameEl    = document.getElementById('cf-name');
  const emailEl   = document.getElementById('cf-email');
  const messageEl = document.getElementById('cf-message');
  const status    = document.getElementById('form-status');

  const name    = nameEl.value.trim();
  const email   = emailEl.value.trim();
  const message = messageEl.value.trim();

  status.style.display = 'block';

  if (!name || !email || !message) {
    status.style.color   = '#e55';
    status.textContent   = '⚠️ Please fill in all fields.';
    return;
  }

  // ---- Replace this block with your actual submission logic ----
  status.style.color  = 'var(--accent)';
  status.textContent  = '✅ Message sent! I\'ll get back to you soon.';
  nameEl.value    = '';
  emailEl.value   = '';
  messageEl.value = '';
  // ---------------------------------------------------------------

  setTimeout(() => { status.style.display = 'none'; }, 5000);
}

// Expose globally so onclick in HTML works
window.sendMessage  = sendMessage;
window.closeSidebar = closeSidebar;
