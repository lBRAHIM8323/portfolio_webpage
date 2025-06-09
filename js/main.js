/**
 * Portfolio Website JavaScript
 * Handles navigation, animations, form submission, and interactive features
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

/**
 * Initialize all app functionality
 */
function initializeApp() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeContactForm();
    initializeBackToTop();
    initializeMobileMenu();
    initializeTypingAnimation();
    initializeSectionObserver();
    initializeExperienceDropdown(); // Added dropdown functionality
}

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });
}

/**
 * Smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                const navMenu = document.getElementById('nav-menu');
                const navToggle = document.getElementById('nav-toggle');

                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');

                const children = entry.target.querySelectorAll('.project-card, .skill-item, .timeline-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('fade-in-up');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('section, .project-card, .skill-item, .timeline-item');
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Contact form handling
 */
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    form.setAttribute('action', 'https://formspree.io/f/xzzgzeje');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showFormStatus('success', 'Thank you! Your message has been sent successfully.');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormStatus('error', 'Sorry, there was an error sending your message. Please try again later.');
        } finally {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    function showFormStatus(type, message) {
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        formStatus.style.display = 'block';

        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
}

/**
 * Back to top button functionality
 */
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Mobile menu functionality
 */
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

/**
 * Typing animation for hero section
 */
function initializeTypingAnimation() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const roles = [
        'AI/ML Engineer.',
        'AI Automation Engineer.',
        'Python developer.',
        'Building Intelligent Systems With Gen AI.',
        'Responsible AI Advocate.'
    ];

    let currentRole = 0;
    let currentChar = 0;
    let isDeleting = false;

    function typeAnimation() {
        const current = roles[currentRole];

        if (isDeleting) {
            subtitle.textContent = current.substring(0, currentChar - 1);
            currentChar--;
        } else {
            subtitle.textContent = current.substring(0, currentChar + 1);
            currentChar++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && currentChar === current.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentRole = (currentRole + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(typeAnimation, typeSpeed);
    }

    setTimeout(typeAnimation, 1000);
}

/**
 * Section highlighting in navigation
 */
function initializeSectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -80px 0px'
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');

                navLinks.forEach(link => link.classList.remove('active'));

                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
}

/**
 * Experience section dropdown functionality
 */
function initializeExperienceDropdown() {
    const positionCards = document.querySelectorAll('.position-card');

    positionCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');

        const toggleCard = () => {
            const details = card.querySelector('.position-details');
            const icon = card.querySelector('.expand-icon');
            const isExpanded = details.classList.contains('expanded');

            if (isExpanded) {
                details.classList.remove('expanded');
                icon.classList.remove('expanded');
                card.classList.remove('expanded');
            } else {
                details.classList.add('expanded');
                icon.classList.add('expanded');
                card.classList.add('expanded');
            }

            card.setAttribute('aria-expanded', !isExpanded);
        };

        card.addEventListener('click', toggleCard);
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard();
            }
        });
    });
}

/**
 * Utility functions
 */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function revealElement(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}

// Close mobile menu with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');

        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Resize handling
window.addEventListener('resize', debounce(function () {
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');

        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
}, 250));

// Image preload
function preloadImages() {
    const images = [
        'assets/AI-powered.png',
        'assets/braintumor.jpeg',
        'assets/fire.jpeg',
        'assets/HR-KPI.png',
        'assets/profile.png',
        'assets/stock.jpeg'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}
setTimeout(preloadImages, 1000);

// Console log for developers
console.log(`
🚀 Portfolio Website
Built with HTML, CSS, and JavaScript
Feel free to check out the code!

GitHub: https://github.com/lBRAHIM8323
`);
