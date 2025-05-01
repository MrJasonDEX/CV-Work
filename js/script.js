// Initialize AOS for scroll animations
AOS.init({
    duration: 800,
    once: true
});

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

// Enhanced skill bars animation
const skillBars = document.querySelectorAll('.skill-bar');
const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const level = bar.getAttribute('data-level');
            bar.style.setProperty('--skill-level', `${level}%`);
            observer.unobserve(bar);
        }
    });
};

const skillObserver = new IntersectionObserver(animateSkills, {
    threshold: 0.5
});

skillBars.forEach(bar => skillObserver.observe(bar));

// Dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initialize theme based on user preference or system preference
    const darkMode = localStorage.getItem('darkMode') === 'true' || prefersDark.matches;
    document.body.classList.toggle('dark-mode', darkMode);
    updateThemeIcon(darkMode);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        updateThemeIcon(isDark);
    });
    
    // Update theme icon
    function updateThemeIcon(isDark) {
        themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Active section highlighting
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${id}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${id}"]`)?.classList.remove('active');
        }
    });
});

// Portfolio filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        document.querySelector('.filter-btn.active').classList.remove('active');
        button.classList.add('active');
        
        portfolioItems.forEach(item => {
            const shouldShow = filter === 'all' || item.dataset.category === filter;
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.display = shouldShow ? 'block' : 'none';
                if (shouldShow) {
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                }
            }, 300);
        });
    });
});

// Enhanced form validation and submission
const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const formProps = Object.fromEntries(formData);
    
    // Basic validation
    for (let key in formProps) {
        if (!formProps[key]) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
    }
    
    try {
        // Simulated form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        showNotification('Message sent successfully!', 'success');
        form.reset();
    } catch (error) {
        showNotification('Failed to send message', 'error');
    }
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// Progressive loading for portfolio images
const portfolioImages = document.querySelectorAll('.portfolio-item img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

portfolioImages.forEach(img => imageObserver.observe(img));

// Initialize Testimonials Carousel
$(document).ready(function() {
    $('#carouselTestimonials').carousel();
});