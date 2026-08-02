/* ==========================================================================
   VERCEL / APPLE STYLE INTERACTION ENGINE
   Developer: Laxman — Computer Engineering Student
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initScrollProgress();
    initThemeToggle();
    initNavbarAndScrollSpy();
    initMobileDrawer();
    initScrollReveal();
    initGitHubHeatmap();
    initBackToTop();
    setCurrentYear();
});

/* --------------------------------------------------------------------------
   01. SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
    const progressBar = document.getElementById("scroll-progress-bar");
    if (!progressBar) return;

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

/* --------------------------------------------------------------------------
   02. THEME TOGGLE (DARK / LIGHT MODE)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem("theme") || "dark";
    htmlEl.setAttribute("data-theme", savedTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const currentTheme = htmlEl.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            htmlEl.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}

/* --------------------------------------------------------------------------
   03. NAVBAR STICKY GLASS & SCROLLSPY
   -------------------------------------------------------------------------- */
function initNavbarAndScrollSpy() {
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        let currentSection = "";
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSection = sec.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    });
}

/* --------------------------------------------------------------------------
   04. MOBILE MENU DRAWER
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
    const toggleBtn = document.getElementById("mobile-toggle");
    const drawer = document.getElementById("mobile-drawer");
    const links = document.querySelectorAll(".mobile-nav-link");

    if (!toggleBtn || !drawer) return;

    function toggleMenu() {
        toggleBtn.classList.toggle("active");
        drawer.classList.toggle("open");
        document.body.style.overflow = drawer.classList.contains("open") ? "hidden" : "";
    }

    toggleBtn.addEventListener("click", toggleMenu);
    links.forEach(l => l.addEventListener("click", toggleMenu));
}

/* --------------------------------------------------------------------------
   05. SUBTLE SCROLL REVEAL (FADE + 12PX TRANSLATE)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal-element");

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        elements.forEach(el => el.classList.add("active"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   06. GITHUB HEATMAP GENERATION
   -------------------------------------------------------------------------- */
function initGitHubHeatmap() {
    const container = document.getElementById("github-heatmap");
    if (!container) return;

    container.innerHTML = "";
    const totalSquares = 52 * 7;

    for (let i = 0; i < totalSquares; i++) {
        const square = document.createElement("div");
        square.classList.add("heatmap-cell");

        const rand = Math.random();
        let level = "sq-0";
        if (rand > 0.86) level = "sq-4";
        else if (rand > 0.72) level = "sq-3";
        else if (rand > 0.55) level = "sq-2";
        else if (rand > 0.38) level = "sq-1";

        square.classList.add(level);
        container.appendChild(square);
    }
}

/* --------------------------------------------------------------------------
   07. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const backBtn = document.getElementById("back-to-top");
    if (!backBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backBtn.classList.add("visible");
        } else {
            backBtn.classList.remove("visible");
        }
    });

    backBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* --------------------------------------------------------------------------
   08. SET CURRENT YEAR
   -------------------------------------------------------------------------- */
function setCurrentYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
