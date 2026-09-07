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
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  if (themeToggle) themeToggle.querySelector('span').textContent = isDark ? '☀' : '☾';
};
const savedTheme = localStorage.getItem('eneric-theme');
applyTheme(savedTheme || (systemTheme.matches ? 'dark' : 'light'));
themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem('eneric-theme', nextTheme);
});
systemTheme.addEventListener?.('change', (event) => {
  if (!localStorage.getItem('eneric-theme')) applyTheme(event.matches ? 'dark' : 'light');
});

const header = document.querySelector('.site-header');
const openingVideo = document.querySelector('.hero-visual');
const updateHeaderState = () => {
  if (!header || !openingVideo) return;
  header.classList.toggle('is-floating', openingVideo.getBoundingClientRect().bottom <= 72);
};
window.addEventListener('scroll', updateHeaderState, { passive: true });
window.addEventListener('resize', updateHeaderState);
updateHeaderState();

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
    if (!entry.isIntersecting) {
      entry.target._countersArmed = true;
      return;
    }
    if (entry.target._countersArmed === false) return;
    entry.target._countersArmed = false;
    entry.target.querySelectorAll('.counter').forEach(countUp);
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-counter-group]').forEach((section) => {
  section._countersArmed = true;
  counterObserver.observe(section);
});

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


const storeRender = document.querySelector(".cc-store-render");
if (storeRender) {
  const storeInfoTitle = storeRender.querySelector(".store-info b");
  const storeInfoCopy = storeRender.querySelector(".store-info span");
  storeRender.querySelectorAll(".store-hotspot").forEach((hotspot) => {
    hotspot.addEventListener("click", () => {
      storeRender.querySelectorAll(".store-hotspot").forEach((item) => item.classList.remove("active"));
      hotspot.classList.add("active");
      storeInfoTitle.textContent = hotspot.dataset.storeTitle;
      storeInfoCopy.textContent = hotspot.dataset.storeCopy;
    });
  });
  storeRender.addEventListener("pointermove", (event) => {
    const bounds = storeRender.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    storeRender.style.setProperty("--store-tilt-x", (x * -4) + "deg");
    storeRender.style.setProperty("--store-tilt-y", (y * 3) + "deg");
  });
  storeRender.addEventListener("pointerleave", () => {
    storeRender.style.setProperty("--store-tilt-x", "0deg");
    storeRender.style.setProperty("--store-tilt-y", "0deg");
  });
}


const commandTabs = document.querySelectorAll(".cc-tab");
const setCommandView = (name) => {
  commandTabs.forEach((tab) => {
    const active = tab.dataset.commandView === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".cc-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.commandPanel === name));
};
commandTabs.forEach((tab) => tab.addEventListener("click", () => setCommandView(tab.dataset.commandView)));

const universe = document.querySelector(".cc-universe");
if (universe) {
  const universeTitle = universe.querySelector(".universe-info b");
  const universeCopy = universe.querySelector(".universe-info span");
  universe.querySelectorAll(".universe-node").forEach((node) => {
    node.addEventListener("click", () => {
      universe.querySelectorAll(".universe-node").forEach((item) => item.classList.remove("active"));
      node.classList.add("active");
      universeTitle.textContent = node.dataset.universeTitle;
      universeCopy.textContent = node.dataset.universeCopy;
    });
  });
}


const indiaMapCanvas = document.querySelector(".india-map-canvas");
if (indiaMapCanvas && typeof INDIA_STATE_PATHS !== "undefined") {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 " + INDIA_SVG_WIDTH + " " + INDIA_SVG_HEIGHT);
  svg.setAttribute("aria-hidden", "true");
  INDIA_STATE_PATHS.forEach((state) => {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", state[2]);
    path.setAttribute("class", "india-state");
    svg.appendChild(path);
  });
  const locations = [
    { name: "Solapur, Maharashtra", note: "Blue Energy • public portfolio location", lat: 17.68, lon: 75.91 },
    { name: "Akola District, Maharashtra", note: "Green Energy • public portfolio location", lat: 20.70, lon: 76.95 },
    { name: "Amravati District, Maharashtra", note: "Green Energy • public portfolio location", lat: 20.93, lon: 77.75 }
  ];
  const bounds = INDIA_GEO_BOUNDS;
  const infoTitle = document.querySelector(".india-map-info b");
  const infoCopy = document.querySelector(".india-map-info span");
  locations.forEach((location, index) => {
    const marker = document.createElementNS(ns, "circle");
    marker.setAttribute("cx", ((location.lon - bounds.lonMin) / (bounds.lonMax - bounds.lonMin) * INDIA_SVG_WIDTH).toFixed(1));
    marker.setAttribute("cy", ((bounds.latMax - location.lat) / (bounds.latMax - bounds.latMin) * INDIA_SVG_HEIGHT).toFixed(1));
    marker.setAttribute("r", index === 0 ? "6" : "5");
    marker.setAttribute("class", "india-map-marker" + (index === 0 ? " active" : ""));
    marker.setAttribute("tabindex", "0");
    marker.setAttribute("role", "button");
    marker.setAttribute("aria-label", location.name);
    const selectLocation = () => {
      svg.querySelectorAll(".india-map-marker").forEach((item) => item.classList.remove("active"));
      marker.classList.add("active");
      infoTitle.textContent = location.name;
      infoCopy.textContent = location.note;
    };
    marker.addEventListener("click", selectLocation);
    marker.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectLocation(); } });
    svg.appendChild(marker);
  });
  indiaMapCanvas.appendChild(svg);
}


const controlWheel = document.querySelector(".cc-wheel-stage");
if (controlWheel) {
  const wheelTitle = document.querySelector(".cc-wheel-readout b");
  const wheelCopy = document.querySelector(".cc-wheel-readout > span");
  controlWheel.querySelectorAll(".cc-wheel-card").forEach((card) => {
    card.addEventListener("click", () => {
      controlWheel.querySelectorAll(".cc-wheel-card").forEach((item) => item.classList.remove("active"));
      card.classList.add("active");
      wheelTitle.textContent = card.dataset.wheelTitle;
      wheelCopy.textContent = card.dataset.wheelCopy;
    });
  });
}

const divisionImageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("image-ready");
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: "350px 0px" });
document.querySelectorAll(".division-card").forEach((card) => divisionImageObserver.observe(card));
