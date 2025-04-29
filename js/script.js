// Smooth scrolling for sidebar navigation
const sidebarLinks = document.querySelectorAll('.sidebar a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth' });
    });
});

// Back to Top button functionality
const backToTopButton = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form validation
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('Please fill out all fields.');
    } else {
        alert('Thank you for your message!');
        form.reset();
    }
});

// Smooth scrolling for new sections
const links = document.querySelectorAll('.sidebar a');
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth' });
    });
});

// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

let isDarkMode = false;

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        body.classList.add('dark-mode');
        themeToggle.textContent = 'Switch to Light Mode';
    } else {
        body.classList.remove('dark-mode');
        themeToggle.textContent = 'Switch to Dark Mode';
    }
});

// Initialize Testimonials Carousel
$(document).ready(function() {
    $('#carouselTestimonials').carousel();
});