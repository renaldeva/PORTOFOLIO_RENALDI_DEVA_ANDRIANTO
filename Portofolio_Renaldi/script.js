/* ================================================
   script.js — Portfolio Renaldi Deva Andrianto
   ================================================ */

// ─────────────────────────────────────────────────
// 1. NAVBAR — scroll style + hamburger + active link
// ─────────────────────────────────────────────────
const header      = document.getElementById('header');
const menuToggle  = document.getElementById('menu-toggle');
const navLinksEl  = document.getElementById('nav-links');
const navLinks    = document.querySelectorAll('.nav-link');

// Scrolled glass effect
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
});

// Hamburger toggle
menuToggle.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Active nav based on scroll position
function updateActiveNav() {
  const sections = ['home', 'about', 'education', 'experience', 'skills', 'portfolio', 'certificates', 'contact'];
  const scrollY = window.scrollY + 120;

  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

// ─────────────────────────────────────────────────
// 2. TYPING ANIMATION (Typewriter effect)
// ─────────────────────────────────────────────────
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Programming',
  'Robotics',
  'IoT & Embedded Systems',
  'Problem Solving',
  'Desain Grafis'
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let typingTimeout;

function type() {
  const current = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      typingTimeout = setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingTimeout = setTimeout(type, 400);
      return;
    }
  }
  typingTimeout = setTimeout(type, deleting ? 55 : 90);
}
setTimeout(type, 800);

// ─────────────────────────────────────────────────
// 3. CANVAS PARTICLE BACKGROUND (Hero)
// ─────────────────────────────────────────────────
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 55;
const particles = [];

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - .5) * .4;
    this.vy = -(Math.random() * .5 + .2);
    this.alpha = Math.random() * .5 + .1;
    this.size  = Math.random() * 2 + .5;
    this.color = Math.random() > .5 ? '56,189,248' : '52,211,153';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= .0008;
    if (this.alpha <= 0 || this.y < -10) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

// Connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.12;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─────────────────────────────────────────────────
// 4. SCROLL REVEAL (IntersectionObserver)
// ─────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.section-reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger skill bars if inside skills section
      const bars = entry.target.querySelectorAll('.skill-fill');
      bars.forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// Also observe the skills section directly for bar animation
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });
  skillObserver.observe(skillsSection);
}

// ─────────────────────────────────────────────────
// 5. CONTACT FORM — handler
// ─────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Mengirim...';

    // Simulate send (replace with real backend / EmailJS / FormSubmit)
    setTimeout(() => {
      formSuccess.classList.add('show');
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Kirim Pesan`;
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  });
}

// ─────────────────────────────────────────────────
// 6. SMOOTH SCROLL for anchor links
// ─────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
