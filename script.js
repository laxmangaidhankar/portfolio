/* ==========================================================================
   PORTFOLIO ENGINE — SMOOTH SINGLE-PAGE EXPERIENCE
   Developer: Laxman Gaidhankar
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initScrollProgress();
    initThemeToggle();
    initSoundEngine();
    initFullscreenMenu();
    initSocialModal();
    initHeroSpecialties();
    initProjectsCarouselAndFilters();
    initSmoothNavigation();
    initClipboardCopy();
    setCurrentYear();
});

/* --------------------------------------------------------------------------
   01. SCROLL PROGRESS BAR (Matches Orange Top Bar in Screenshots)
   -------------------------------------------------------------------------- */
function initScrollProgress() {
    const progressBar = document.getElementById("scroll-progress-bar");
    if (!progressBar) return;

    function updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();
}

/* --------------------------------------------------------------------------
   02. THEME TOGGLE (LIGHT / DARK)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    const htmlEl = document.documentElement;

    // Check saved theme or default to light (matching screenshot)
    const savedTheme = localStorage.getItem("theme") || "light";
    htmlEl.setAttribute("data-theme", savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const currentTheme = htmlEl.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            htmlEl.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);

            playSound("toggle");
            showToast(`Theme switched to ${newTheme} mode`);
        });
    }
}

/* --------------------------------------------------------------------------
   03. SOUND ENGINE (Web Audio API - No External Files Needed)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = false;

function initSoundEngine() {
    const soundBtn = document.getElementById("sound-toggle-btn");
    const soundIcon = document.getElementById("sound-icon");
    const soundLabel = document.getElementById("sound-label");

    if (!soundBtn) return;

    soundBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled;

        if (soundEnabled && !audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }

        if (soundEnabled) {
            if (soundIcon) soundIcon.className = "fa-solid fa-volume-high nav-icon";
            soundBtn.style.color = "var(--accent-orange)";
            playSound("toggle");
            showToast("Sound effects enabled");
        } else {
            if (soundIcon) soundIcon.className = "fa-solid fa-volume-xmark nav-icon";
            soundBtn.style.color = "";
            showToast("Sound effects muted");
        }
    });

    // Attach subtle click sounds to clickable buttons
    document.querySelectorAll(".btn, .nav-btn, .filter-pill, .carousel-arrow-btn").forEach(el => {
        el.addEventListener("click", () => {
            if (el.id !== "sound-toggle-btn") {
                playSound("click");
            }
        });
    });
}

function playSound(type) {
    if (!soundEnabled || !audioCtx) return;

    try {
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === "click") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === "toggle") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === "pop") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(650, now);
            osc.frequency.exponentialRampToValueAtTime(950, now + 0.05);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    } catch (e) {
        // Audio error handling safely ignored
    }
}

/* --------------------------------------------------------------------------
   04. FULLSCREEN / SLIDE-IN NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initFullscreenMenu() {
    const menuBtn = document.getElementById("menu-toggle-btn");
    const closeBtn = document.getElementById("close-menu-btn");
    const menu = document.getElementById("fullscreen-menu");
    const backdrop = document.getElementById("menu-backdrop");
    const links = document.querySelectorAll(".menu-link");

    if (!menuBtn || !menu) return;

    function openMenu() {
        menu.classList.add("open");
        menu.setAttribute("aria-hidden", "false");
        menuBtn.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
        playSound("pop");
    }

    function closeMenu() {
        menu.classList.remove("open");
        menu.setAttribute("aria-hidden", "true");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    menuBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);

    links.forEach(link => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("open")) {
            closeMenu();
        }
    });
}

/* --------------------------------------------------------------------------
   05. SOCIAL MODAL
   -------------------------------------------------------------------------- */
function initSocialModal() {
    const socialBtn = document.getElementById("social-modal-btn");
    const closeBtn = document.getElementById("close-social-btn");
    const modal = document.getElementById("social-modal");
    const backdrop = document.getElementById("social-backdrop");
    const copyQuickBtn = document.getElementById("copy-email-btn");

    if (!socialBtn || !modal) return;

    function openModal() {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        playSound("pop");
    }

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    }

    socialBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });

    if (copyQuickBtn) {
        copyQuickBtn.addEventListener("click", () => {
            copyToClipboard("laxmangaidhankar44@gmail.com", "Email copied to clipboard!");
            closeModal();
        });
    }
}

/* --------------------------------------------------------------------------
   06. HERO SPECIALTIES LIST INTERACTIVITY
   -------------------------------------------------------------------------- */
function initHeroSpecialties() {
    const items = document.querySelectorAll(".specialty-item");
    if (!items.length) return;

    items.forEach(item => {
        item.addEventListener("mouseenter", () => {
            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            playSound("pop");
        });

        item.addEventListener("click", () => {
            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            playSound("click");
        });
    });
}

/* --------------------------------------------------------------------------
   07. PROJECTS CAROUSEL & CATEGORY FILTERS (Matches Image 3)
   -------------------------------------------------------------------------- */
function initProjectsCarouselAndFilters() {
    const container = document.getElementById("projects-container");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const filterPills = document.querySelectorAll(".filter-pill");
    const cards = document.querySelectorAll(".project-card");

    if (!container) return;

    // Carousel Navigation
    function getScrollStep() {
        const firstCard = container.querySelector(".project-card:not([style*='display: none'])");
        if (firstCard) {
            return firstCard.offsetWidth + 28; // card width + gap
        }
        return 400;
    }

    function updateArrowStates() {
        if (!prevBtn || !nextBtn) return;
        const maxScroll = container.scrollWidth - container.clientWidth;
        prevBtn.disabled = container.scrollLeft <= 5;
        nextBtn.disabled = container.scrollLeft >= maxScroll - 5;
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            container.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            container.scrollBy({ left: getScrollStep(), behavior: "smooth" });
        });
    }

    container.addEventListener("scroll", updateArrowStates, { passive: true });
    updateArrowStates();

    // Category Filtering
    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            const filter = pill.getAttribute("data-filter");

            filterPills.forEach(p => {
                p.classList.remove("active");
                p.setAttribute("aria-selected", "false");
            });
            pill.classList.add("active");
            pill.setAttribute("aria-selected", "true");

            cards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    card.style.display = "flex";
                    card.style.opacity = "0";
                    setTimeout(() => {
                        card.style.opacity = "1";
                    }, 50);
                } else {
                    card.style.display = "none";
                }
            });

            // Smoothly reset carousel scroll to start
            container.scrollTo({ left: 0, behavior: "smooth" });
            setTimeout(updateArrowStates, 300);
        });
    });
}

/* --------------------------------------------------------------------------
   08. SMOOTH ANCHOR SCROLLING
   -------------------------------------------------------------------------- */
function initSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href === "#") return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   09. CLIPBOARD COPY UTILITIES
   -------------------------------------------------------------------------- */
function initClipboardCopy() {
    const copyInlineBtn = document.getElementById("copy-email-inline");
    const statusText = document.getElementById("copy-status-text");

    if (copyInlineBtn) {
        copyInlineBtn.addEventListener("click", () => {
            copyToClipboard("laxmangaidhankar44@gmail.com", "Email copied to clipboard!");
            if (statusText) {
                statusText.textContent = "Copied!";
                setTimeout(() => {
                    statusText.textContent = "Copy";
                }, 2500);
            }
        });
    }
}

function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            playSound("toggle");
            showToast(successMsg);
        }).catch(() => {
            fallbackCopy(text, successMsg);
        });
    } else {
        fallbackCopy(text, successMsg);
    }
}

function fallbackCopy(text, successMsg) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand("copy");
        playSound("toggle");
        showToast(successMsg);
    } catch (err) {
        showToast("Unable to copy to clipboard");
    }
    document.body.removeChild(textArea);
}

/* --------------------------------------------------------------------------
   10. TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
let toastTimeout = null;

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

/* --------------------------------------------------------------------------
   11. SET CURRENT YEAR
   -------------------------------------------------------------------------- */
function setCurrentYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
