/* ============================================================================
   Mattia De Santis — Portfolio interactions
   Data-driven resume + tasteful, reduced-motion-aware motion layer.
   ========================================================================== */

// ── Resume data ─────────────────────────────────────────────────────────────
const experienceData = [
  {
    role: "Project Engineer & AI Specialist",
    company: "Studio Ferrando",
    period: "2026 — Present",
    description: "I turn the founder's ideas and briefs into working products, building most of them in Python with AI and LLM tooling. My work spans full-stack development, software engineering and machine learning."
  },
  {
    role: "Credit Care Specialist",
    company: "Europa Factor Spa",
    period: "2025 — 2026",
    description: "Managing a portfolio of overdue accounts and negotiating settlements — ownership, numbers and difficult conversations under pressure."
  },
  {
    role: "Personal Trainer",
    company: "SSD Fonte Meravigliosa",
    period: "2024 — 2025",
    description: "Led facility operations and daily problem-solving, coordinating people and schedules to keep things running."
  },
  {
    role: "Financial & Technical Employee",
    company: "Blitz Antincendio Srl",
    period: "2023 — 2024",
    description: "Operational management of contracts and supplier coordination across financial and technical workflows."
  }
];

const educationData = [
  {
    degree: "Bachelor's in Computer Engineering & AI",
    school: "Epicode Institute of Technology",
    period: "2025 — Present"
  },
  {
    degree: "Master in Sports & Lifestyle Management",
    school: "Rome Business School",
    period: "2023 — 2024"
  },
  {
    degree: "Bachelor's in Sport Sciences",
    school: "University of Foro Italico, Rome",
    period: "2017 — 2023"
  }
];

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline('experience-list', experienceData, (d) => `
    <span class="period">${d.period}</span>
    <h4>${d.role}</h4>
    <p class="org">${d.company}</p>
    <p>${d.description}</p>
  `);

  renderTimeline('education-list', educationData, (d) => `
    <span class="period">${d.period}</span>
    <h4>${d.degree}</h4>
    <p class="org">${d.school}</p>
  `);

  setYear();
  setAge();
  initTheme();
  initMobileNav();
  initScrollProgress();
  initHeaderState();
  initScrollSpy();
  initReveal();      // must run after timeline items exist
  initStatCounters();
  initContactForm();

  if (!prefersReduced && !isTouch()) {
    initSpotlight();
    initMagnetic();
  }
});

// ── Resume rendering ────────────────────────────────────────────────────────
function renderTimeline(containerId, data, template) {
  const container = document.getElementById(containerId);
  if (!container) return;
  data.forEach((item, i) => {
    const el = document.createElement('article');
    el.className = 't-item reveal';
    el.style.setProperty('--i', i);
    el.innerHTML = template(item);
    container.appendChild(el);
  });
}

// ── Footer year ─────────────────────────────────────────────────────────────
function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

// Age computed from date of birth, so it self-increments every year on 21 June.
function setAge() {
  const el = document.getElementById('age');
  if (!el) return;
  const dob = new Date(1997, 5, 21); // 21 June 1997 (month is 0-based)
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) age--;
  el.textContent = age;
}

// ── Theme toggle (persisted, respects system preference) ────────────────────
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const meta = document.querySelector('meta[name="theme-color"]');

  // Dark is the brand default; a visitor's explicit choice is remembered.
  const stored = localStorage.getItem('theme');
  const initial = stored || 'dark';
  applyTheme(initial);

  toggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (meta) meta.setAttribute('content', theme === 'light' ? '#fafafa' : '#0b0b10');
  }
}

// ── Mobile nav ──────────────────────────────────────────────────────────────
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const openIco = hamburger.querySelector('.icon-open');
  const shutIco = hamburger.querySelector('.icon-shut');

  const setOpen = (open) => {
    navLinks.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (openIco) openIco.style.display = open ? 'none' : 'block';
    if (shutIco) shutIco.style.display = open ? 'block' : 'none';
  };

  hamburger.addEventListener('click', () => setOpen(!navLinks.classList.contains('active')));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

// ── Scroll progress bar ─────────────────────────────────────────────────────
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// ── Header background on scroll ──────────────────────────────────────────────
function initHeaderState() {
  const header = document.querySelector('header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 12);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

// ── Scroll spy (active nav link) ────────────────────────────────────────────
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-links a');
  if (!sections.length) return;

  const byId = {};
  links.forEach(l => { byId[l.getAttribute('href')] = l; });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        byId['#' + entry.target.id]?.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => obs.observe(s));
}

// ── Scroll reveal ───────────────────────────────────────────────────────────
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        o.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  items.forEach(el => obs.observe(el));
}

// ── Stat counters ───────────────────────────────────────────────────────────
function initStatCounters() {
  const nums = document.querySelectorAll('.num[data-count]');
  if (!nums.length) return;

  const run = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const valEl = el.querySelector('.val');
    if (!valEl) return;
    if (prefersReduced) { valEl.textContent = target; return; }

    const duration = 1100;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      valEl.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { run(entry.target); o.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  nums.forEach(n => obs.observe(n));
}

// ── Hero mouse spotlight ────────────────────────────────────────────────────
function initSpotlight() {
  const hero = document.querySelector('.hero');
  const spot = document.querySelector('.hero-spotlight');
  if (!hero || !spot) return;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
    spot.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

// ── Magnetic buttons ────────────────────────────────────────────────────────
function initMagnetic() {
  document.querySelectorAll('.hero-cta .btn').forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

// ── Contact form (Web3Forms) ────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        status.classList.add('ok');
        status.textContent = 'Thanks — your message is on its way.';
        form.reset();
      } else {
        status.classList.add('err');
        status.textContent = json.message || 'Something went wrong. Please email me directly.';
      }
    } catch {
      status.classList.add('err');
      status.textContent = 'Network error. Please email me directly.';
    } finally {
      btn.disabled = false;
    }
  });
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function isTouch() {
  return window.matchMedia('(hover: none)').matches;
}
