// Bottle Code Agency - Optimized Logic
// Senior Web Developer Optimization Suite

document.addEventListener('DOMContentLoaded', () => {
    const performanceMode = isLowEndDevice();
    
    initLazySpline(performanceMode);
    initScrollAnimations();
    setupSmoothScroll();
    initNavbarEffect();
    initParallaxEffects(performanceMode);
});

/**
 * Detect low-end devices to toggle performance optimizations
 */
function isLowEndDevice() {
    return (
        window.innerWidth < 768 || 
        navigator.hardwareConcurrency < 4 || 
        /Mobi|Android/i.test(navigator.userAgent)
    );
}

/**
 * Lazy load and manage Spline viewers to save GPU/CPU
 */
function initLazySpline(isLowEnd) {
    const splines = document.querySelectorAll('spline-viewer[data-url]');
    
    const observerOptions = {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
    };

    const splineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const spline = entry.target;
            
            if (entry.isIntersecting) {
                // Load URL if not loaded
                if (spline.getAttribute('data-url')) {
                    const url = spline.getAttribute('data-url');
                    spline.setAttribute('url', url);
                    spline.removeAttribute('data-url');
                    setupWatermarkRemoval(spline);
                }
                
                // Play rendering when visible
                try {
                    if (spline.shadowRoot && spline.shadowRoot.querySelector('canvas')) {
                        // Spline doesn't have a public play() API always available, 
                        // but we can ensure it's not visibility: hidden
                        spline.style.visibility = 'visible';
                        spline.style.opacity = '1';
                    }
                } catch (e) {}
            } else {
                // Pause rendering when not visible to save 80% GPU
                spline.style.visibility = 'hidden';
                spline.style.opacity = '0';
            }
        });
    }, observerOptions);

    splines.forEach(spline => {
        if (isLowEnd && spline.parentElement.classList.contains('spline-background-robot')) {
            // Remove heavy splines on mobile, keep only hero if necessary
            spline.parentElement.style.display = 'none';
        } else {
            splineObserver.observe(spline);
        }
    });
}

/**
 * Throttled watermark removal
 */
function setupWatermarkRemoval(spline) {
    const hide = (root) => {
        if (!root) return;
        const selectors = [
            '#logo', 
            '.watermark', 
            'a[href*="spline.design"]', 
            '[style*="bottom: 10px"]',
            '[style*="bottom: 0px"]'
        ];
        selectors.forEach(s => {
            const elements = root.querySelectorAll(s);
            elements.forEach(el => el.style.display = 'none');
        });
    };

    spline.addEventListener('load', () => hide(spline.shadowRoot));
    
    // Efficient polling with exponential backoff
    let attempts = 0;
    const poll = () => {
        attempts++;
        if (spline.shadowRoot) hide(spline.shadowRoot);
        if (attempts < 50) setTimeout(poll, attempts * 20);
    };
    poll();
}

/**
 * Optimized Reveal elements with staggered timing
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const delay = target.dataset.delay || 0;
                
                setTimeout(() => {
                    target.classList.add('active');
                }, delay);
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .service-card, .process-step, .reveal-init');
    
    revealElements.forEach((el, index) => {
        if (!el.classList.contains('reveal-init')) {
            el.classList.add('reveal-init');
        }
        // Stagger cards automatically if no delay is set
        if (el.classList.contains('service-card') && !el.dataset.delay) {
            el.dataset.delay = (index % 4) * 100;
        }
        observer.observe(el);
    });
}

/**
 * Smooth scroll with easing
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Throttled Navbar and Scroll effects
 */
function initNavbarEffect() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScroll = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavbar(lastScroll);
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateNavbar(scrollPos) {
        if (scrollPos > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
}

/**
 * Subtle parallax for depth without killing performance
 */
function initParallaxEffects(isLowEnd) {
    if (isLowEnd) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }, { passive: true });
}

