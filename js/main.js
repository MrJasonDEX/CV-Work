// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
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