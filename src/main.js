import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Console check ──────────────────────────────────────────────────────────
console.log("Luminar v3: Entorno cargado correctamente.");

// ─── Hero reveal animation ───────────────────────────────────────────────────
gsap.from(".reveal-hero", {
  y: 40,
  opacity: 0,
  duration: 1.4,
  stagger: 0.25,
  ease: "power3.out",
  delay: 0.3
});

// ─── Navbar dinámico al hacer scroll ─────────────────────────────────────────
const nav = document.getElementById('main-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.remove('bg-transparent', 'border-transparent', 'py-6');
      nav.classList.add('bg-luminar-bg/80', 'backdrop-blur-md', 'border-luminar-text/10', 'py-4');
    } else {
      nav.classList.add('bg-transparent', 'border-transparent', 'py-6');
      nav.classList.remove('bg-luminar-bg/80', 'backdrop-blur-md', 'border-luminar-text/10', 'py-4');
    }
  }, { passive: true });
}

// ─── Mobile Fullscreen Menu ───────────────────────────────────────────────────
const mobileMenu    = document.getElementById('mobile-menu');
const openBtn       = document.getElementById('menu-open-btn');
const closeBtn      = document.getElementById('menu-close-btn');
const mobileLinks   = gsap.utils.toArray('#mobile-menu .mobile-nav-link');

// Build a reusable timeline (paused initially)
const menuTl = gsap.timeline({ paused: true })
  .to(mobileMenu, {
    opacity: 1,
    duration: 0.35,
    ease: 'power2.out',
    pointerEvents: 'all',
    onStart: () => {
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // lock page scroll
    }
  })
  .from(mobileLinks, {
    y: 24,
    opacity: 0,
    duration: 0.45,
    stagger: 0.08,
    ease: 'power3.out'
  }, '-=0.1');

function openMenu() { menuTl.play(); }

function closeMenu() {
  menuTl.reverse().then(() => {
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // unlock page scroll
    gsap.set(mobileMenu, { pointerEvents: 'none' });
  });
}

if (openBtn)  openBtn.addEventListener('click', openMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);

// Close when any link is tapped
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// ─── Servicios B — Sticky Scroll Pin ─────────────────────────────────────────
const pinWrapper  = document.getElementById('services-pin-wrapper');
const images      = gsap.utils.toArray('.service-image');
const panels      = gsap.utils.toArray('.service-panel');
const dots        = gsap.utils.toArray('.service-dot');
const counter     = document.getElementById('svc-current');
const labels      = ['01', '02', '03'];

function showSlide(index) {
  // Fade in the active image, fade out the rest
  images.forEach((img, i) => {
    gsap.to(img, {
      opacity: i === index ? 1 : 0,
      duration: 0.8,
      ease: 'power2.inOut'
    });
  });

  // Slide + fade in the active panel, slide out the rest
  panels.forEach((panel, i) => {
    if (i === index) {
      gsap.fromTo(panel,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      );
    } else {
      gsap.to(panel, { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in' });
    }
  });

  // Update dots
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add('bg-luminar-accent');
      dot.classList.remove('bg-transparent', 'opacity-50');
    } else {
      dot.classList.remove('bg-luminar-accent');
      dot.classList.add('bg-transparent', 'opacity-50');
    }
  });

  // Update counter
  if (counter) counter.textContent = labels[index];
}

if (pinWrapper && images.length && panels.length) {
  // Each service occupies 1/3 of the total scroll distance
  const totalH    = pinWrapper.offsetHeight; // 300vh
  const segmentH  = totalH / 3;

  ScrollTrigger.create({
    trigger: pinWrapper,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      // progress 0–1 across the whole wrapper
      const idx = Math.min(Math.floor(self.progress * 3), 2);
      // Only trigger a change when the index changes
      if (self._lastIdx !== idx) {
        self._lastIdx = idx;
        showSlide(idx);
      }
    }
  });
}
