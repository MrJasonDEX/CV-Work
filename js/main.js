// Theme handling
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('theme', theme);
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Skill bars animation
const skillBars = document.querySelectorAll('.skill-bar');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const level = entry.target.getAttribute('data-level');
            const levelBar = entry.target.querySelector('.skill-bar__level');
            levelBar.style.width = `${level}%`;
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// Initialize skill bars animation
function initializeSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.dataset.skill;
                const progressBar = entry.target.querySelector('.progress-bar');
                progressBar.style.width = `${skillLevel}%`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', initializeSkills);

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section?.scrollIntoView({ behavior: 'smooth' });
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact__form');
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
    } catch (error) {
        showNotification('Failed to send message', 'error');
    } finally {
        submitBtn.disabled = false;
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
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

// Active section highlighting
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightCurrentSection);

// Scroll to top button
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Certificate flip animation
document.querySelectorAll('.cert-item').forEach(cert => {
    cert.addEventListener('click', () => {
        cert.classList.toggle('flipped');
    });
});

// Performance optimization
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add animation on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateObserver.unobserve(entry.target);
            }
        });
    });

    animateElements.forEach(el => animateObserver.observe(el));
});

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// CV Download
function downloadCV() {
    const link = document.createElement('a');
    link.href = 'assets/Jason-Gillan-CV.pdf';
    link.download = 'Jason-Gillan-CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Reading time indicator
function addReadingTimeIndicator() {
    const content = document.querySelector('main').textContent;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    
    const indicator = document.createElement('div');
    indicator.className = 'reading-time';
    indicator.innerHTML = `<i class="far fa-clock"></i> ${readingTime} min read`;
    
    document.querySelector('.header__content').appendChild(indicator);
}

document.addEventListener('DOMContentLoaded', addReadingTimeIndicator);

// GitHub Activity Feed
async function fetchGitHubActivity() {
    try {
        const response = await fetch('https://api.github.com/users/MrJasonDEX/events/public');
        const data = await response.json();
        const activityContainer = document.getElementById('github-activity');
        
        const activities = data.slice(0, 5).map(event => {
            const date = new Date(event.created_at).toLocaleDateString();
            return `<div class="github-activity-item">
                        <i class="fab fa-github"></i>
                        <span>${event.type.replace('Event', '')} - ${date}</span>
                    </div>`;
        });
        
        activityContainer.innerHTML = activities.join('');
    } catch (error) {
        console.error('Error fetching GitHub activity:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchGitHubActivity);