const button = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
button?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  button.setAttribute('aria-expanded', String(isOpen));
  button.textContent = isOpen ? '×' : '☰';
});
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open'); button?.setAttribute('aria-expanded', 'false'); if (button) button.textContent = '☰';
}));

const fontOptions = document.querySelectorAll('.font-option');
const setFont = (font) => {
  const selected = font === 'dm-sans' ? '"DM Sans", sans-serif' : '"Montserrat", sans-serif';
  document.documentElement.style.setProperty('--site-font', selected);
  fontOptions.forEach((option) => {
    const active = option.dataset.font === font;
    option.classList.toggle('active', active);
    option.setAttribute('aria-pressed', String(active));
  });
  localStorage.setItem('eneric-font', font);
};
const savedFont = localStorage.getItem('eneric-font');
if (savedFont === 'montserrat' || savedFont === 'dm-sans') setFont(savedFont);
fontOptions.forEach((option) => option.addEventListener('click', () => setFont(option.dataset.font)));

const themeToggle = document.querySelector('.theme-toggle');
const setTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  if (themeToggle) themeToggle.querySelector('span').textContent = isDark ? '☀' : '☾';
  localStorage.setItem('eneric-theme', theme);
};
const savedTheme = localStorage.getItem('eneric-theme');
setTheme(savedTheme === 'light' ? 'light' : 'dark');
themeToggle?.addEventListener('click', () => setTheme(document.body.classList.contains('dark-theme') ? 'light' : 'dark'));

const header = document.querySelector('.site-header');
const openingVideo = document.querySelector('.hero-visual');
const updateHeaderState = () => {
  if (!header || !openingVideo) return;
  header.classList.toggle('is-floating', openingVideo.getBoundingClientRect().bottom <= 72);
};
window.addEventListener('scroll', updateHeaderState, { passive: true });
window.addEventListener('resize', updateHeaderState);
updateHeaderState();

const counters = document.querySelectorAll('.counter');
const countUp = (element) => {
  const target = Number(element.dataset.target);
  const start = performance.now();
  const duration = 1300;
  if (element._counterAnimation) cancelAnimationFrame(element._counterAnimation);
  element.textContent = '0';
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) element._counterAnimation = requestAnimationFrame(update);
  };
  element._counterAnimation = requestAnimationFrame(update);
};
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.counter').forEach(countUp);
  });
}, { threshold: 0.55 });
document.querySelectorAll('[data-counter-group]').forEach((section) => counterObserver.observe(section));

const divisionGrid = document.querySelector('.division-grid');
const openDivision = (card) => {
  divisionGrid?.classList.add('is-expanded');
  card.classList.add('is-expanded');
  document.body.classList.add('division-active');
  card.querySelector('.division-close')?.focus();
};
const closeDivision = () => {
  divisionGrid?.classList.remove('is-expanded');
  divisionGrid?.querySelector('.division-card.is-expanded')?.classList.remove('is-expanded');
  document.body.classList.remove('division-active');
};
document.querySelectorAll('.division-open').forEach((button) => button.addEventListener('click', () => openDivision(button.closest('.division-card'))));
document.querySelectorAll('.division-close').forEach((button) => button.addEventListener('click', closeDivision));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDivision(); });

const leaderGrid = document.querySelector('.leader-grid');
const openLeader = (card) => {
  leaderGrid?.classList.add('is-expanded');
  card.classList.add('is-open');
  document.body.classList.add('division-active');
  card.querySelector('.leader-close')?.focus();
};
const closeLeader = () => {
  leaderGrid?.classList.remove('is-expanded');
  leaderGrid?.querySelector('.leader-card.is-open')?.classList.remove('is-open');
  document.body.classList.remove('division-active');
};
document.querySelectorAll('.leader-open').forEach((button) => button.addEventListener('click', () => openLeader(button.closest('.leader-card'))));
document.querySelectorAll('.leader-card').forEach((card) => card.addEventListener('click', () => {
  if (!card.classList.contains('is-open')) openLeader(card);
}));
document.querySelectorAll('.leader-close').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); closeLeader(); }));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLeader(); });

const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
let carouselIndex = 0;
const moveCarousel = (direction) => {
  if (!carouselTrack || !carouselSlides.length) return;
  const visible = window.innerWidth <= 760 ? 1 : 3;
  const maxIndex = Math.max(0, carouselSlides.length - visible);
  carouselIndex = (carouselIndex + direction + maxIndex + 1) % (maxIndex + 1);
  const step = carouselTrack.parentElement.clientWidth / visible + 18 / visible;
  carouselTrack.style.transform = `translateX(-${carouselIndex * step}px)`;
};
document.querySelector('.carousel-next')?.addEventListener('click', () => moveCarousel(1));
document.querySelector('.carousel-prev')?.addEventListener('click', () => moveCarousel(-1));
let carouselTimer = setInterval(() => moveCarousel(1), 5000);
document.querySelector('.project-carousel')?.addEventListener('mouseenter', () => clearInterval(carouselTimer));

const dashboardTabs = document.querySelectorAll('.dashboard-tab');
const setDashboardPanel = (name) => {
  dashboardTabs.forEach((tab) => {
    const active = tab.dataset.dashboard === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.dashboard-panel').forEach((panel) => panel.classList.toggle('active', panel.dataset.dashboardPanel === name));
};
dashboardTabs.forEach((tab) => tab.addEventListener('click', () => setDashboardPanel(tab.dataset.dashboard)));
