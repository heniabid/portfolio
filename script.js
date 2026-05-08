
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else { const t = document.querySelector(href); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); } }
  });
});

// Reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
reveals.forEach(el => io.observe(el));

// Skill bar animation
const skillIo = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.skill-fill').forEach(f => f.classList.add('animated')); skillIo.unobserve(e.target); } });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-section').forEach(s => skillIo.observe(s));

// Counters
document.querySelectorAll('.counter').forEach(el => {
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const t = parseFloat(el.dataset.target), d = parseInt(el.dataset.decimals), dur = 1800, s = performance.now();
    const ease = x => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2;
    (function u(n) { const p = Math.min((n-s)/dur,1); el.textContent = (t*ease(p)).toFixed(d); if(p<1) requestAnimationFrame(u); })(s);
  }, { threshold: 0.5 }).observe(el);
});

// Nav scroll
const topNav = document.getElementById('topNav');
window.addEventListener('scroll', () => topNav.classList.toggle('scrolled', scrollY > 60), { passive: true });

// Hero grid spotlight
const heroGrid = document.querySelector('.hero-grid');
const heroEl = document.getElementById('hero');
let gx = 0, gy = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
  const heroRect = heroEl.getBoundingClientRect();
  const gridRect = heroGrid.getBoundingClientRect();
  const activeTop = heroRect.top + heroRect.height * 0.3;
  if (e.clientY >= activeTop && e.clientY <= heroRect.bottom) { tx = e.clientX - gridRect.left; ty = e.clientY - gridRect.top; }
  else { tx = gridRect.width / 2; ty = gridRect.height * 0.3; }
});
(function lerpGrid() {
  gx += (tx - gx) * 0.08; gy += (ty - gy) * 0.08;
  heroGrid.style.setProperty('--mx', gx + 'px'); heroGrid.style.setProperty('--my', gy + 'px');
  requestAnimationFrame(lerpGrid);
})();

// Side panels
const sectionEls = document.querySelectorAll('section[id]');
const leftDots = document.querySelectorAll('.side-panel.left .side-dot');
const rightDots = document.querySelectorAll('.side-panel.right .side-dot');
const leftTrack = document.getElementById('leftTrack');
const rightTrack = document.getElementById('rightTrack');
const scrollPctEl = document.getElementById('scrollPct');
function updatePanels() {
  const y = scrollY + innerHeight * 0.4;
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const pct = Math.min(scrollY / maxScroll, 1);
  let activeIndex = 0;
  sectionEls.forEach((s, i) => { if (y >= s.offsetTop) activeIndex = i; });
  const trackPct = (pct * 100).toFixed(0);
  if (leftTrack) leftTrack.style.height = trackPct + '%';
  if (rightTrack) rightTrack.style.height = trackPct + '%';
  if (scrollPctEl) scrollPctEl.textContent = String(trackPct).padStart(2,'0');
  leftDots.forEach((d,i) => d.classList.toggle('active', i === Math.min(activeIndex, leftDots.length-1)));
  rightDots.forEach((d,i) => d.classList.toggle('active', i === Math.min(activeIndex, rightDots.length-1)));
}
window.addEventListener('scroll', updatePanels, { passive: true });
updatePanels();

// Mobile menu
const toggle = document.getElementById('navToggle'), menu = document.getElementById('mobileMenu');
let menuOpen = false;
function openMenu() { menuOpen=true; toggle.classList.add('active'); toggle.setAttribute('aria-expanded','true'); menu.classList.add('open'); document.body.classList.add('menu-open'); }
function closeMenu() { if(!menuOpen) return; menuOpen=false; toggle.classList.remove('active'); toggle.setAttribute('aria-expanded','false'); menu.classList.remove('open'); document.body.classList.remove('menu-open'); }
toggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
menu.querySelectorAll('.mobile-menu-link').forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (innerWidth > 1024) closeMenu(); });
