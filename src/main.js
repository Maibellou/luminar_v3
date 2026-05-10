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
const toggleBtn     = document.getElementById('menu-toggle-btn');
const mobileLinks   = gsap.utils.toArray('#mobile-menu .mobile-nav-link');

// Build a reusable timeline (paused initially)
const menuTl = gsap.timeline({ paused: true })
  .to(mobileMenu, {
    opacity: 1,
    duration: 0.35,
    ease: 'power2.out',
    pointerEvents: 'auto',
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

function toggleMenu() {
  if (toggleBtn.classList.contains('is-active')) {
    // Close menu
    toggleBtn.classList.remove('is-active');
    menuTl.reverse().then(() => {
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // unlock page scroll
      gsap.set(mobileMenu, { pointerEvents: 'none' });
    });
  } else {
    // Open menu
    toggleBtn.classList.add('is-active');
    menuTl.play();
  }
}

if (toggleBtn) toggleBtn.addEventListener('click', toggleMenu);

// Close when any link is tapped
mobileLinks.forEach(link => link.addEventListener('click', () => {
  if (toggleBtn.classList.contains('is-active')) {
    toggleMenu();
  }
}));

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
      autoAlpha: i === index ? 1 : 0,
      duration: i === index ? 0.6 : 0.4,
      ease: 'power2.inOut',
      overwrite: true
    });
  });

  // Slide + fade in the active panel, slide out the rest
  panels.forEach((panel, i) => {
    if (i === index) {
      gsap.fromTo(panel,
        { autoAlpha: 0, y: 32 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', overwrite: true }
      );
    } else {
      gsap.to(panel, { autoAlpha: 0, y: -24, duration: 0.3, ease: 'power2.in', overwrite: true });
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

// ─── ScrollSpy — Active Nav Link Indicator ──────────────────────────────────
const navLinks = gsap.utils.toArray('.nav-link');
const sections = ['servicios-a', 'nosotros', 'proyectos', 'contacto'];

sections.forEach(id => {
  const section = document.getElementById(id);
  if (section) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'bottom 40%',
      onToggle: self => {
        if (self.isActive) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('nav-link-active');
            } else {
              link.classList.remove('nav-link-active');
            }
          });
        }
      }
    });
  }
});

// Clear active links when at the very top (Hero)
ScrollTrigger.create({
  trigger: 'header',
  start: 'top top',
  end: 'bottom 40%',
  onEnter: () => navLinks.forEach(l => l.classList.remove('nav-link-active')),
  onEnterBack: () => navLinks.forEach(l => l.classList.remove('nav-link-active'))
});
