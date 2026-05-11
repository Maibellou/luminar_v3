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

// ─── Contact Form Handler ────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const submitSpinner = document.getElementById('submit-spinner');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset status
    formStatus.className = 'hidden text-sm text-center mt-2 font-secondary rounded p-3';
    formStatus.textContent = '';

    // Show loading state
    submitBtn.disabled = true;
    submitText.classList.add('opacity-0');
    submitSpinner.classList.remove('hidden');

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      message: document.getElementById('message').value,
    };

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        formStatus.textContent = 'Mensaje enviado correctamente. Nos pondremos en contacto a la brevedad.';
        formStatus.classList.remove('hidden');
        formStatus.classList.add('bg-green-500/20', 'text-green-400', 'border', 'border-green-500/30');
        contactForm.reset();
      } else {
        // Error from API
        throw new Error(result.error || result.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      // Network or API Error
      console.error('Submit error:', error);
      formStatus.textContent = 'Hubo un error al enviar el mensaje. Por favor, intente nuevamente.';
      formStatus.classList.remove('hidden');
      formStatus.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/30');
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      submitText.classList.remove('opacity-0');
      submitSpinner.classList.add('hidden');
    }
  });
}
