// Dynamic Section Loading and Animations
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
    setupSmoothScrolling();
    setupScrollAnimations();
    setupNavbarEffects();
});

function initializePortfolio() {
    // Show first section immediately
    const firstSection = document.querySelector('section');
    if (firstSection) {
        firstSection.classList.add('active');
        animateContent(firstSection);
    }
}

function setupScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    // Intersection Observer for section visibility
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class to current section
                entry.target.classList.add('active');
                animateContent(entry.target);
                
                // Remove active class from other sections for single-section view
                sections.forEach(section => {
                    if (section !== entry.target) {
                        section.classList.remove('active');
                        // Reset animations for non-active sections
                        const animateElements = section.querySelectorAll('.content-animate');
                        animateElements.forEach(element => {
                            element.classList.remove('show');
                        });
                    }
                });
            }
        });
    }, {
        threshold: 0.5, // Trigger when 50% of section is visible
        rootMargin: '-10% 0px -10% 0px'
    });

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

function animateContent(section) {
    const animateElements = section.querySelectorAll('.content-animate');
    
    animateElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('show');
        }, index * 150); // Stagger animations
    });
}

function setupSmoothScrolling() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupNavbarEffects() {
    const navbar = document.querySelector('.nav-bar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToNextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToPrevSection();
    }
});

function scrollToNextSection() {
    const sections = document.querySelectorAll('section');
    const currentSection = document.querySelector('section.active');
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToPrevSection() {
    const sections = document.querySelectorAll('section');
    const currentSection = document.querySelector('section.active');
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Initialize first section
    const firstSection = document.querySelector('section');
    if (firstSection) {
        firstSection.classList.add('active');
        animateContent(firstSection);
    }
});