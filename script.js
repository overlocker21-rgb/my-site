const cards = document.querySelectorAll('.program-card');
const layers = {
  love: document.querySelector('.ambient-hearts'),
  neon: document.querySelector('.ambient-neon'),
  rain: document.querySelector('.ambient-rain')
};

let particleTimer = null;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function spawnParticle(theme) {
  const layer = layers[theme];
  if (!layer) return;

  const particle = document.createElement('span');
  const size = 14 + Math.random() * 22;
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.setProperty('--duration', `${2.8 + Math.random() * 3}s`);
  particle.style.fontSize = `${size}px`;

  if (theme === 'love') {
    particle.className = 'particle';
    particle.textContent = Math.random() > .45 ? '♡' : '♥';
    particle.style.color = Math.random() > .5 ? '#ff9fbc' : '#fff1f5';
  }

  if (theme === 'neon') {
    particle.className = 'particle neon-particle';
    const glyphs = ['✦', '×', '⚡', '★', '///'];
    particle.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
  }

  if (theme === 'rain') {
    particle.className = 'rain-drop';
    particle.style.left = `${Math.random() * 110}%`;
    particle.style.setProperty('--duration', `${.65 + Math.random() * .65}s`);
    particle.style.setProperty('--length', `${35 + Math.random() * 70}px`);
  }

  layer.appendChild(particle);
  particle.addEventListener('animationend', () => particle.remove());
}

function activateTheme(theme) {
  if (reduceMotion) return;
  clearInterval(particleTimer);
  document.body.classList.remove('theme-love', 'theme-neon', 'theme-rain');
  document.body.classList.add(`theme-${theme}`);

  for (let i = 0; i < 10; i += 1) {
    setTimeout(() => spawnParticle(theme), i * 65);
  }
  particleTimer = setInterval(() => spawnParticle(theme), theme === 'rain' ? 70 : 180);
}

function deactivateTheme() {
  clearInterval(particleTimer);
  particleTimer = null;
  document.body.classList.remove('theme-love', 'theme-neon', 'theme-rain');
}

cards.forEach((card) => {
  card.addEventListener('mouseenter', () => activateTheme(card.dataset.theme));
  card.addEventListener('mouseleave', deactivateTheme);
  card.addEventListener('focusin', () => activateTheme(card.dataset.theme));
  card.addEventListener('focusout', deactivateTheme);
  card.addEventListener('touchstart', () => {
    if (!document.body.classList.contains(`theme-${card.dataset.theme}`)) {
      activateTheme(card.dataset.theme);
      setTimeout(deactivateTheme, 2200);
    }
  }, { passive: true });
});

// Reveal blocks as the reader moves through the page.
const revealItems = document.querySelectorAll(
  '.hero-copy, .hero-doctor, .section-heading, .program-card, .steps article, .expert-card, .team-quote, .appointment-copy, .appointment-form'
);

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    revealObserver.observe(item);
  });
}

// A short money shower follows active scrolling, capped to keep the DOM light.
let lastMoneyAt = 0;
function dropMoney() {
  if (document.querySelectorAll('.money-particle').length > 28) return;
  const note = document.createElement('span');
  note.className = 'money-particle';
  note.textContent = ['💸', '💵', '🪙', '💰'][Math.floor(Math.random() * 4)];
  note.style.left = `${Math.random() * 100}vw`;
  note.style.fontSize = `${18 + Math.random() * 25}px`;
  note.style.setProperty('--duration', `${2.7 + Math.random() * 2.5}s`);
  note.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
  note.style.setProperty('--spin', `${180 + Math.random() * 720}deg`);
  document.body.appendChild(note);
  note.addEventListener('animationend', () => note.remove());
}

window.addEventListener('scroll', () => {
  if (reduceMotion || performance.now() - lastMoneyAt < 85) return;
  lastMoneyAt = performance.now();
  dropMoney();
  if (Math.random() > .45) dropMoney();
}, { passive: true });

document.addEventListener('pointermove', (event) => {
  document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
  document.documentElement.style.setProperty('--my', `${event.clientY}px`);
});

cards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (reduceMotion || Math.random() > .28) return;
    const spark = document.createElement('span');
    spark.className = 'spark';
    spark.textContent = card.dataset.theme === 'love' ? '💖' : card.dataset.theme === 'neon' ? '⚡' : '💧';
    spark.style.left = `${event.clientX}px`;
    spark.style.top = `${event.clientY}px`;
    spark.style.setProperty('--sx', `${-40 + Math.random() * 80}px`);
    spark.style.setProperty('--sy', `${-55 + Math.random() * 35}px`);
    document.body.appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove());
  });
});

const form = document.querySelector('#appointmentForm');
const formStatus = document.querySelector('#formStatus');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(form).get('name').trim();
  formStatus.textContent = `${name}, анамнез принят. Осталось подключить форму к вашему способу связи.`;
  form.reset();
});
