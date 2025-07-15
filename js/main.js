// Smooth scroll for anchor links (ignore navbar toggler)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    // Only smooth scroll if not a navbar toggler
    if (!this.classList.contains('navbar-toggler')) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
  });
});

// Dynamic nav link highlighting on scroll
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));
window.addEventListener('scroll', () => {
  let current = sections[0];
  sections.forEach((section, i) => {
    if (section && window.scrollY >= section.offsetTop - 120) {
      current = section;
      navLinks.forEach(l => l.classList.remove('active'));
      if (navLinks[i]) navLinks[i].classList.add('active');
    }
  });
});

// Fade-in animation on scroll
const fadeEls = document.querySelectorAll('.section, .project-card, .about-card');
const fadeInOnScroll = () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('DOMContentLoaded', () => {
  fadeEls.forEach(el => el.classList.add('fade-in'));
  fadeInOnScroll();
});

// Modal accessibility (Bootstrap handles focus trap)
// Optionally, you can add more ARIA enhancements here