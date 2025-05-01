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
    
    skillItems.forEach(item => {
        const skillLevel = item.dataset.skill;
        const progressBar = item.querySelector('.progress-bar');
        progressBar.style.width = `${skillLevel}%`;
    });
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

// Scroll to top button with null check
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

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
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter projects with animation
            projects.forEach(project => {
                if (filter === 'all' || project.dataset.category === filter) {
                    project.style.display = 'block';
                    setTimeout(() => project.style.opacity = '1', 50);
                } else {
                    project.style.opacity = '0';
                    setTimeout(() => project.style.display = 'none', 500);
                }
            });
        });
    });
}

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

// Enhanced Mobile Navigation
function initMobileNav() {
    const nav = document.querySelector('.nav__list');
    let startX, currentX;
    let isDragging = false;

    nav.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    nav.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        nav.scrollLeft += diff;
        startX = currentX;
    });

    nav.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Add swipe indicator
    const swipeHint = document.createElement('div');
    swipeHint.className = 'nav__swipe-hint';
    nav.appendChild(swipeHint);
}

// Improved Dark Mode
function initDarkMode() {
    const darkModeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('darkMode', isDark);
        darkModeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
        
        // Smooth transition for all themed elements
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('darkMode');
    const initialTheme = savedTheme !== null ? savedTheme === 'true' : prefersDark.matches;
    setTheme(initialTheme);

    // Theme toggle
    darkModeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'light';
        setTheme(isDark);
    });

    // System theme changes
    prefersDark.addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
            setTheme(e.matches);
        }
    });
}

// Enhanced game handling
function initGames() {
    // Load game script dynamically
    const gameScript = document.createElement('script');
    gameScript.src = 'js/games.js';
    gameScript.onload = () => {
        document.querySelectorAll('.game-card').forEach(card => {
            const type = card.dataset.game;
            const highScore = getHighScore(type);
            if (highScore) {
                const scoreDisplay = document.createElement('div');
                scoreDisplay.className = 'high-score';
                scoreDisplay.textContent = `Best: ${highScore}`;
                card.querySelector('.game-card__front').appendChild(scoreDisplay);
            }
        });
    };
    document.body.appendChild(gameScript);
}

function getHighScore(game) {
    const scores = JSON.parse(localStorage.getItem('highScores') || '{}');
    return scores[game];
}

function saveHighScore(game, score) {
    const scores = JSON.parse(localStorage.getItem('highScores') || '{}');
    if (score > (scores[game] || 0)) {
        scores[game] = score;
        localStorage.setItem('highScores', JSON.stringify(scores));
        showNotification(`New High Score: ${score}!`, 'success');
    }
}

// Game Modal Handler
const gameModal = document.getElementById('gameModal');
if (gameModal) {
    const gameContent = document.getElementById('gameContent');
    const scoresList = document.getElementById('scoresList');
    const gameHelp = document.getElementById('gameHelp');
    const restartBtn = document.getElementById('restartGame');
    let currentGame = null;
    let currentGameType = null;

    gameModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        currentGameType = button.getAttribute('data-game');
        
        // Set game help content
        const helpContent = {
            memory: 'Match pairs of cards by remembering their positions.',
            snake: 'Use arrow keys or swipe to control the snake. Collect food to grow.',
            quiz: 'Answer tech-related questions. Try to get all correct!'
        };
        gameHelp.innerHTML = `<h4>How to Play</h4><p>${helpContent[currentGameType]}</p>`;
        
        // Initialize game
        gameContent.innerHTML = '<div class="loading-spinner"></div>';
        setTimeout(() => {
            switch(currentGameType) {
                case 'memory': currentGame = new MemoryGame(gameContent); break;
                case 'snake': currentGame = new SnakeGame(gameContent); break;
                case 'quiz': currentGame = new TechQuiz(gameContent); break;
            }
            updateScores(currentGameType);
        }, 500);
    });

    // Handle game restart
    restartBtn?.addEventListener('click', () => {
        if (currentGame) {
            gameContent.innerHTML = '<div class="loading-spinner"></div>';
            setTimeout(() => {
                switch(currentGameType) {
                    case 'memory': currentGame = new MemoryGame(gameContent); break;
                    case 'snake': currentGame = new SnakeGame(gameContent); break;
                    case 'quiz': currentGame = new TechQuiz(gameContent); break;
                }
            }, 500);
        }
    });

    // Update high scores
    function updateScores(gameType) {
        const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
        const gameScores = scores[gameType] || [];
        
        scoresList.innerHTML = gameScores.length ? 
            gameScores.map((score, index) => `
                <div class="score-item">
                    <span>#${index + 1}</span>
                    <span>${score}</span>
                </div>
            `).join('') :
            '<p>No scores yet. Start playing!</p>';
    }

    // Clean up on modal close
    gameModal.addEventListener('hidden.bs.modal', function () {
        if (currentGame?.destroy) {
            currentGame.destroy();
        }
        currentGame = null;
        gameContent.innerHTML = '';
    });
}

// Ebook navigation
function initEbookNav() {
    const chapterLinks = document.querySelectorAll('.chapter-link');
    const sideNav = document.querySelector('.side-nav');
    
    // Add mobile menu toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(menuToggle);

    menuToggle.addEventListener('click', () => {
        sideNav.classList.toggle('active');
    });

    // Hide menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sideNav.contains(e.target) && !menuToggle.contains(e.target)) {
            sideNav.classList.remove('active');
        }
    });

    // Update active chapter
    window.addEventListener('scroll', () => {
        const current = [...document.querySelectorAll('section[id]')]
            .find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });

        if (current) {
            chapterLinks.forEach(link => {
                link.classList.toggle('active', 
                    link.getAttribute('href') === `#${current.id}`);
            });
        }
    });
}

// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav__list');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
        });
    });
}

// Initialize on load with safety checks
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        initMobileNav();
    }
    initDarkMode();
    const githubActivity = document.getElementById('github-activity');
    if (githubActivity) {
        fetchGitHubActivity();
    }
    initializeSkills();
    addReadingTimeIndicator();
    initGames();
    initEbookNav();
    initProjectFilters();
});