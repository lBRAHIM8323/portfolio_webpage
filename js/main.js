/**
 * Enhanced Portfolio Website JavaScript
 * Improved with modern practices, error handling, and performance optimizations
 */

class PortfolioApp {
    constructor() {
        this.config = {
            scrollOffset: 80,
            navbarScrollThreshold: 50,
            backToTopThreshold: 300,
            animationDelay: 100,
            typingSpeed: { typing: 100, deleting: 50, pause: 2000, nextRole: 500 }
        };
        
        this.state = {
            isNavbarVisible: true,
            lastScrollTop: 0,
            currentRole: 0,
            isTyping: false
        };

        this.elements = {};
        this.observers = new Map();
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    /**
     * Setup all app functionality
     */
    setupApp() {
        try {
            this.cacheElements();
            this.initializeFeatures();
            this.bindEvents();
            this.preloadAssets();
            console.log('🚀 Portfolio initialized successfully');
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
            this.handleInitError(error);
        }
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        this.elements = {
            navbar: document.getElementById('navbar'),
            navMenu: document.getElementById('nav-menu'),
            navToggle: document.getElementById('nav-toggle'),
            navLinks: document.querySelectorAll('.nav-link'),
            allNavLinks: document.querySelectorAll('a[href^="#"]'),
            contactForm: document.getElementById('contactForm'),
            formStatus: document.getElementById('form-status'),
            backToTopBtn: document.getElementById('backToTop'),
            heroSubtitle: document.querySelector('.hero-subtitle'),
            sections: document.querySelectorAll('section[id]'),
            positionCards: document.querySelectorAll('.position-card'),
            animatedElements: document.querySelectorAll('section, .project-card, .skill-item, .timeline-item')
        };

        // Validate critical elements
        const criticalElements = ['navbar', 'navMenu', 'navToggle'];
        criticalElements.forEach(key => {
            if (!this.elements[key]) {
                console.warn(`Critical element missing: ${key}`);
            }
        });
    }

    /**
     * Initialize all features
     */
    initializeFeatures() {
        const features = [
            'Navigation',
            'SmoothScrolling',
            'ScrollAnimations',
            'ContactForm',
            'BackToTop',
            'MobileMenu',
            'TypingAnimation',
            'SectionObserver',
            'ExperienceDropdown'
        ];

        features.forEach(feature => {
            try {
                this[`initialize${feature}`]();
            } catch (error) {
                console.error(`Failed to initialize ${feature}:`, error);
            }
        });
    }

    /**
     * Enhanced navigation with performance optimization
     */
    initializeNavigation() {
        if (!this.elements.navbar) return;

        const handleScroll = this.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class
            this.elements.navbar.classList.toggle('scrolled', scrollTop > this.config.navbarScrollThreshold);
            
            // Hide/show navbar on scroll
            if (scrollTop > 100) {
                const isScrollingDown = scrollTop > this.state.lastScrollTop;
                const transform = isScrollingDown ? 'translateY(-100%)' : 'translateY(0)';
                this.elements.navbar.style.transform = transform;
                this.state.isNavbarVisible = !isScrollingDown;
            }
            
            this.state.lastScrollTop = scrollTop;
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Enhanced smooth scrolling with better UX
     */
    initializeSmoothScrolling() {
        this.elements.allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (!targetId.startsWith('#')) return;

                e.preventDefault();
                
                const targetSection = document.querySelector(targetId);
                if (!targetSection) {
                    console.warn(`Target section not found: ${targetId}`);
                    return;
                }

                // Calculate offset considering fixed navbar
                const offsetTop = targetSection.getBoundingClientRect().top + 
                                window.pageYOffset - this.config.scrollOffset;

                // Smooth scroll with proper fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for older browsers
                    this.smoothScrollTo(offsetTop, 800);
                }

                this.closeMobileMenu();
            });
        });
    }

    /**
     * Fallback smooth scroll implementation
     */
    smoothScrollTo(targetY, duration) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const startTime = new Date().getTime();

        const easeInOutQuart = (time, from, distance, duration) => {
            if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
            return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
        };

        const timer = setInterval(() => {
            const time = new Date().getTime() - startTime;
            const newY = easeInOutQuart(time, startY, distance, duration);
            
            if (time >= duration) {
                clearInterval(timer);
                window.scrollTo(0, targetY);
            } else {
                window.scrollTo(0, newY);
            }
        }, 1000 / 60); // 60fps
    }

    /**
     * Enhanced scroll animations with Intersection Observer
     */
    initializeScrollAnimations() {
        const observerOptions = {
            threshold: [0.1, 0.25, 0.5],
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                    this.animateElement(entry.target);
                    animationObserver.unobserve(entry.target); // Animate only once
                }
            });
        }, observerOptions);

        this.elements.animatedElements.forEach(el => {
            animationObserver.observe(el);
        });

        this.observers.set('animation', animationObserver);
    }

    /**
     * Animate element with staggered children
     */
    animateElement(element) {
        element.classList.add('fade-in-up');

        const children = element.querySelectorAll('.project-card, .skill-item, .timeline-item');
        if (children.length > 0) {
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('fade-in-up');
                }, index * this.config.animationDelay);
            });
        }
    }

    /**
     * Enhanced contact form with better error handling
     */
    initializeContactForm() {
        const form = this.elements.contactForm;
        if (!form) return;

        const formStatus = this.elements.formStatus;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!submitBtn) {
            console.warn('Submit button not found in contact form');
            return;
        }

        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Set form action if not already set
        if (!form.getAttribute('action')) {
            form.setAttribute('action', 'https://formspree.io/f/xzzgzeje');
        }

        // Add input validation
        this.addFormValidation(form);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!this.validateForm(form)) {
                this.showFormStatus('error', 'Please fill in all required fields correctly.');
                return;
            }

            this.setSubmitButtonState(true, btnText, btnLoading, submitBtn);

            try {
                const response = await this.submitForm(form);
                
                if (response.ok) {
                    this.showFormStatus('success', 'Thank you! Your message has been sent successfully.');
                    form.reset();
                    this.trackEvent('form_submit', 'success');
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                this.showFormStatus('error', 'Sorry, there was an error sending your message. Please try again later.');
                this.trackEvent('form_submit', 'error', error.message);
            } finally {
                this.setSubmitButtonState(false, btnText, btnLoading, submitBtn);
            }
        });
    }

    /**
     * Add form validation
     */
    addFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let message = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required.';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address.';
        }

        this.setFieldValidation(field, isValid, message);
        return isValid;
    }

    /**
     * Validate entire form
     */
    validateForm(form) {
        const fields = form.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Set field validation state
     */
    setFieldValidation(field, isValid, message) {
        const parent = field.closest('.form-group') || field.parentElement;
        const errorElement = parent.querySelector('.field-error') || this.createErrorElement();

        if (isValid) {
            field.classList.remove('error');
            parent.classList.remove('has-error');
            if (errorElement.parentElement === parent) {
                errorElement.remove();
            }
        } else {
            field.classList.add('error');
            parent.classList.add('has-error');
            errorElement.textContent = message;
            if (errorElement.parentElement !== parent) {
                parent.appendChild(errorElement);
            }
        }
    }

    /**
     * Create error element
     */
    createErrorElement() {
        const error = document.createElement('span');
        error.className = 'field-error';
        error.style.cssText = 'color: #e74c3c; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
        return error;
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const parent = field.closest('.form-group') || field.parentElement;
        parent.classList.remove('has-error');
        const errorElement = parent.querySelector('.field-error');
        if (errorElement) errorElement.remove();
    }

    /**
     * Email validation
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Submit form with proper error handling
     */
    async submitForm(form) {
        const formData = new FormData(form);
        
        return fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    /**
     * Set submit button state
     */
    setSubmitButtonState(isLoading, btnText, btnLoading, submitBtn) {
        if (btnText) btnText.style.display = isLoading ? 'none' : 'inline';
        if (btnLoading) btnLoading.style.display = isLoading ? 'inline-flex' : 'none';
        submitBtn.disabled = isLoading;
        submitBtn.setAttribute('aria-busy', isLoading);
    }

    /**
     * Show form status with auto-hide
     */
    showFormStatus(type, message) {
        const formStatus = this.elements.formStatus;
        if (!formStatus) return;

        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        formStatus.setAttribute('role', type === 'error' ? 'alert' : 'status');

        // Clear any existing timeout
        if (this.formStatusTimeout) {
            clearTimeout(this.formStatusTimeout);
        }

        this.formStatusTimeout = setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }

    /**
     * Enhanced back to top with smooth animation
     */
    initializeBackToTop() {
        const backToTopBtn = this.elements.backToTopBtn;
        if (!backToTopBtn) return;

        const handleScroll = this.throttle(() => {
            const shouldShow = window.pageYOffset > this.config.backToTopThreshold;
            backToTopBtn.classList.toggle('visible', shouldShow);
        }, 16);

        window.addEventListener('scroll', handleScroll, { passive: true });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });

        // Add keyboard support
        backToTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });
    }

    /**
     * Scroll to top with animation
     */
    scrollToTop() {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            this.smoothScrollTo(0, 800);
        }
        
        this.trackEvent('navigation', 'back_to_top');
    }

    /**
     * Enhanced mobile menu with accessibility
     */
    initializeMobileMenu() {
        const navToggle = this.elements.navToggle;
        const navMenu = this.elements.navMenu;
        
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => this.toggleMobileMenu());

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Add keyboard support
        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMobileMenu();
            }
        });
    }

    /**
     * Toggle mobile menu with proper ARIA attributes
     */
    toggleMobileMenu() {
        const navMenu = this.elements.navMenu;
        const navToggle = this.elements.navToggle;
        
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active', isActive);
        
        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', isActive);
        navMenu.setAttribute('aria-hidden', !isActive);
        
        // Focus management
        if (isActive) {
            navMenu.querySelector('a')?.focus();
        }
        
        this.trackEvent('navigation', isActive ? 'mobile_menu_open' : 'mobile_menu_close');
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const navMenu = this.elements.navMenu;
        const navToggle = this.elements.navToggle;
        
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
    }

    /**
     * Enhanced typing animation with better performance
     */
    initializeTypingAnimation() {
        const subtitle = this.elements.heroSubtitle;
        if (!subtitle || this.state.isTyping) return;

        const roles = [
            'AI/ML Engineer.',
            'AI Automation Engineer.',
            'Python Developer.',
            'Building Intelligent Systems With Gen AI.',
            'Responsible AI Advocate.'
        ];

        let currentRole = 0;
        let currentChar = 0;
        let isDeleting = false;
        let timeoutId;

        const typeAnimation = () => {
            const current = roles[currentRole];
            const { typingSpeed } = this.config;

            if (isDeleting) {
                subtitle.textContent = current.substring(0, currentChar - 1);
                currentChar--;
            } else {
                subtitle.textContent = current.substring(0, currentChar + 1);
                currentChar++;
            }

            let speed = isDeleting ? typingSpeed.deleting : typingSpeed.typing;

            if (!isDeleting && currentChar === current.length) {
                speed = typingSpeed.pause;
                isDeleting = true;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentRole = (currentRole + 1) % roles.length;
                speed = typingSpeed.nextRole;
            }

            timeoutId = setTimeout(typeAnimation, speed);
        };

        this.state.isTyping = true;
        setTimeout(typeAnimation, 1000);

        // Store timeout for cleanup
        this.typingTimeout = timeoutId;
    }

    /**
     * Enhanced section observer with performance optimization
     */
    initializeSectionObserver() {
        const sections = this.elements.sections;
        const navLinks = this.elements.navLinks;
        
        if (!sections.length || !navLinks.length) return;

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            const visibleSections = entries.filter(entry => entry.isIntersecting);
            
            if (visibleSections.length > 0) {
                // Get the most visible section
                const mostVisible = visibleSections.reduce((prev, current) => 
                    current.intersectionRatio > prev.intersectionRatio ? current : prev
                );
                
                this.updateActiveNavLink(mostVisible.target.getAttribute('id'));
            }
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
        this.observers.set('section', sectionObserver);
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(sectionId) {
        this.elements.navLinks.forEach(link => link.classList.remove('active'));
        
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Enhanced experience dropdown with accessibility
     */
    initializeExperienceDropdown() {
        this.elements.positionCards.forEach(card => {
            // Set up accessibility attributes
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-expanded', 'false');

            const toggleCard = () => {
                const details = card.querySelector('.position-details');
                const icon = card.querySelector('.expand-icon');
                const isExpanded = details?.classList.contains('expanded') || false;

                if (isExpanded) {
                    details?.classList.remove('expanded');
                    icon?.classList.remove('expanded');
                    card.classList.remove('expanded');
                } else {
                    details?.classList.add('expanded');
                    icon?.classList.add('expanded');
                    card.classList.add('expanded');
                }

                card.setAttribute('aria-expanded', !isExpanded);
                this.trackEvent('experience', isExpanded ? 'collapse' : 'expand');
            };

            card.addEventListener('click', toggleCard);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard();
                }
            });
        });
    }

    /**
     * Bind global events
     */
    bindEvents() {
        // Escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });

        // Resize handling with debounce
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        }, 250), { passive: true });

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Error handling
        window.addEventListener('error', (e) => {
            console.error('Runtime error:', e.error);
            this.trackEvent('error', 'runtime_error', e.error?.message);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.trackEvent('error', 'unhandled_promise', e.reason?.message);
        });
    }

    /**
     * Pause animations when tab is not visible
     */
    pauseAnimations() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
    }

    /**
     * Resume animations when tab becomes visible
     */
    resumeAnimations() {
        if (this.elements.heroSubtitle && !this.state.isTyping) {
            this.initializeTypingAnimation();
        }
    }

    /**
     * Preload assets for better performance
     */
    async preloadAssets() {
        const images = [
            'assets/AI-powered.png',
            'assets/braintumor.jpeg',
            'assets/fire.jpeg',
            'assets/HR-KPI.png',
            'assets/profile.png',
            'assets/stock.jpeg'
        ];

        const preloadPromises = images.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });
        });

        try {
            await Promise.all(preloadPromises);
            console.log('✅ All images preloaded successfully');
        } catch (error) {
            console.warn('⚠️ Some images failed to preload:', error);
        }
    }

    /**
     * Handle initialization errors gracefully
     */
    handleInitError(error) {
        // Show user-friendly error message
        const errorContainer = document.createElement('div');
        errorContainer.className = 'init-error';
        errorContainer.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 1rem; margin: 1rem; border-radius: 0.375rem; text-align: center;">
                <strong>Oops!</strong> Something went wrong initializing the website. Please refresh the page.
            </div>
        `;
        document.body.insertBefore(errorContainer, document.body.firstChild);
    }

    /**
     * Analytics/tracking helper
     */
    trackEvent(category, action, label = '') {
        // Implement your analytics tracking here
        console.log(`📊 Event: ${category}.${action}${label ? ` (${label})` : ''}`);
        
        // Example Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    /**
     * Utility: Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        // Clear timeouts
        if (this.typingTimeout) clearTimeout(this.typingTimeout);
        if (this.formStatusTimeout) clearTimeout(this.formStatusTimeout);

        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        console.log('🧹 Portfolio app cleaned up');
    }
}

// Initialize the enhanced portfolio app
const portfolioApp = new PortfolioApp();

// Make it globally available for debugging
window.portfolioApp = portfolioApp;

// Enhanced console message
console.log(`
🚀 Enhanced Portfolio Website
Built with modern JavaScript practices

Features:
✅ Class-based architecture
✅ Error handling & validation
✅ Performance optimizations
✅ Accessibility improvements
✅ Analytics ready

GitHub: https://github.com/lBRAHIM8323
`);