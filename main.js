/**
 * Bottle Code Agency - Digital Craftsmanship
 * Animation Engine: Fanta-Style Section Transitions
 */

gsap.registerPlugin(ScrollTrigger);

const modelViewer = document.getElementById('skull-model');

function updateOrbit(azimuth, polar, distance) {
    modelViewer.cameraOrbit = `${azimuth}deg ${polar}deg ${distance}m`;
}

function initAnimations() {
    // 1. Initial State (Hero)
    // Text is on the LEFT, Skull is on the RIGHT
    gsap.set(modelViewer, { 
        xPercent: 30, 
        yPercent: 0, 
        scale: 1.2, 
        opacity: 0 
    });
    updateOrbit(0, 75, 2);
    
    gsap.to(modelViewer, { opacity: 1, duration: 1.5 });

    // 2. Transition: Hero -> Servicios
    // Triggers when "Nuestra Maestría" section starts coming up
    const tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: ".services",
            start: "top 90%", // Start when section is near bottom
            end: "top 10%",   // End when section is near top
            scrub: 1,
        }
    });

    tl1.to(modelViewer, {
        xPercent: -35, // Move to the left
        scale: 0.7,
        onUpdate: function() {
            const p = this.progress();
            const azimuth = gsap.utils.interpolate(0, 180, p);
            const polar = gsap.utils.interpolate(75, 90, p);
            const dist = gsap.utils.interpolate(2, 2.8, p);
            updateOrbit(azimuth, polar, dist);
        }
    });

    // 3. Transition: Servicios -> Proyectos
    // The skull moves away and fades out smoothly into the background
    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".projects",
            start: "top bottom",
            end: "top 20%",
            scrub: 1,
        }
    });

    tl2.to(modelViewer, {
        xPercent: 100, // Moves out of frame to the right
        yPercent: -50,
        scale: 0.2,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: function() {
            const p = this.progress();
            const azimuth = gsap.utils.interpolate(180, 360, p);
            const polar = gsap.utils.interpolate(90, 45, p);
            const dist = gsap.utils.interpolate(2.8, 6, p);
            updateOrbit(azimuth, polar, dist);
        }
    });

    // 4. Transition: Proyectos -> Contacto
    const tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: ".cta",
            start: "top 95%",
            end: "top 20%",
            scrub: 1,
        }
    });

    tl3.to(modelViewer, {
        xPercent: 0,
        yPercent: -20,
        scale: 0.4,
        opacity: 0.2,
        onUpdate: function() {
            const p = this.progress();
            const azimuth = gsap.utils.interpolate(-90, 0, p);
            const polar = gsap.utils.interpolate(80, 75, p);
            const dist = gsap.utils.interpolate(2.2, 4, p);
            updateOrbit(azimuth, polar, dist);
        }
    });
}

// Navbar Scroll Effect
function initNavbar() {
    const nav = document.querySelector('.pill-nav');
    ScrollTrigger.create({
        start: "top -50",
        onUpdate: (self) => {
            if (self.direction === 1) {
                gsap.to(nav, { y: -20, opacity: 0.8, duration: 0.3 });
            } else {
                gsap.to(nav, { y: 0, opacity: 1, duration: 0.3 });
            }
        }
    });
}

// Reveal animations for text
function initReveals() {
    const revealElements = document.querySelectorAll('.content-wrapper, .service-card, .project-item, .section-header');
    
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
}

window.addEventListener('load', () => {
    initAnimations();
    initNavbar();
    initReveals();
});
