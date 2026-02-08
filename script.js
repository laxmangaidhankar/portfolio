// ===== INITIAL SETUP =====
document.addEventListener("DOMContentLoaded", () => {
    setupSmoothScrolling();
    setupScrollAnimations();
    setupNavbarEffects();
    activateFirstSection();
});

// ===== FIRST SECTION ANIMATION =====
function activateFirstSection() {
    const first = document.querySelector("section");
    if (!first) return;
    first.classList.add("active");
    animateContent(first);
}

// ===== INTERSECTION OBSERVER =====
function setupScrollAnimations() {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const section = entry.target;
            section.classList.add("active");
            animateContent(section);

            // Remove active states from other sections
            sections.forEach(s => {
                if (s !== section) {
                    s.classList.remove("active");
                    resetContentAnimations(s);
                }
            });
        });
    }, {
        threshold: 0.5,
        rootMargin: "-10% 0px -10% 0px"
    });

    sections.forEach(sec => observer.observe(sec));
}

// ===== ANIMATIONS =====
function animateContent(section) {
    section.querySelectorAll(".content-animate").forEach((el, i) => {
        setTimeout(() => el.classList.add("show"), i * 150);
    });
}

function resetContentAnimations(section) {
    section.querySelectorAll(".content-animate").forEach(el => {
        el.classList.remove("show");
    });
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

// ===== NAVBAR EFFECTS =====
function setupNavbarEffects() {
    const navbar = document.querySelector(".nav-bar");
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener("keydown", (e) => {
    if (["ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        scrollToAdjacentSection(1);
    }
    if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        scrollToAdjacentSection(-1);
    }
});

function scrollToAdjacentSection(direction) {
    const sections = Array.from(document.querySelectorAll("section"));
    const current = document.querySelector("section.active");
    const index = sections.indexOf(current);
    const nextIndex = index + direction;

    if (nextIndex >= 0 && nextIndex < sections.length) {
        sections[nextIndex].scrollIntoView({ behavior: "smooth" });
    }
}
document.getElementById("form-status").style.display = "none";


document.getElementById("contact-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // Prevent form from leaving the page

    const form = e.target;

    // Send form data to Web3Forms
    let response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form)
    });

    let statusMessage = document.getElementById("form-status");

    if (response.ok) {
        statusMessage.style.display = "block";   // Show the thank-you message
        form.reset();                            // Clear all input fields
    } else {
        statusMessage.style.display = "block";
        statusMessage.style.color = "red";
        statusMessage.innerText = "❌ Something went wrong. Please try again.";
    }
});

// ===== SET CURRENT YEAR =====
document.getElementById("year").textContent = new Date().getFullYear();
