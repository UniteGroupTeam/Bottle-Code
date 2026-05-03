// Bottle Code Agency - Logic

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    setupSmoothScroll();
    initNavbarEffect();
    removeSplineWatermark();
});

/**
 * Fallback to remove Spline watermark from shadow DOM
 */
function removeSplineWatermark() {
    const splines = document.querySelectorAll('spline-viewer');
    splines.forEach(spline => {
        const hide = (root) => {
            if (!root) return;
            const selectors = ['#logo', '.watermark', 'a[href*="spline.design"]', '[style*="position: absolute; bottom: 10px; right: 10px;"]'];
            selectors.forEach(s => {
                const el = root.querySelector(s);
                if (el) el.style.display = 'none';
            });
        };

        spline.addEventListener('load', () => hide(spline.shadowRoot));
        
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            hide(spline.shadowRoot);
            if (attempts > 100) clearInterval(interval);
        }, 100);
    });
}

/**
 * Reveal elements as they scroll into view
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .service-card, .process-step');
    
    revealElements.forEach((el, index) => {
        // Initial styles
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        
        observer.observe(el);
    });

    // Handle the 'active' class via transition
    document.addEventListener('scroll', () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });
}

/**
 * Smooth scroll for navigation links
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Navbar background effect on scroll
 */
function initNavbarEffect() {
    const nav = document.getElementById('main-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '0.75rem 2rem';
            nav.style.background = 'rgba(0, 0, 0, 0.9)';
        } else {
            nav.style.padding = '1.25rem 2rem';
            nav.style.background = 'rgba(0, 0, 0, 0.7)';
        }
    });
}

/**
 * Add micro-interactions to buttons
 */
document.querySelectorAll('.btn-cta, .btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        const icon = button.querySelector('svg');
        if (icon) {
            icon.style.transform = 'translateX(5px)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        const icon = button.querySelector('svg');
        if (icon) {
            icon.style.transform = 'translateX(0)';
        }
    });
});
