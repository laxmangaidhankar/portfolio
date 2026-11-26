document.addEventListener('DOMContentLoaded', () => {
    const htmlEl = document.documentElement;

    // 1. Theme Toggle (Light <-> Dark Monochrome)
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio_theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    };

    applyTheme(localStorage.getItem('portfolio_theme') || 'light');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next);
        });
    }

    // 2. Slide-Out Right Menu Drawer
    const slideMenu = document.getElementById('slide-menu');
    const menuOpenBtn = document.getElementById('menu-toggle-btn');
    const menuCloseBtn = document.getElementById('close-menu-btn');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const setMenuOpen = (open) => {
        if (!slideMenu) return;
        slideMenu.classList.toggle('open', open);
        slideMenu.setAttribute('aria-hidden', String(!open));
        if (menuOpenBtn) menuOpenBtn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    if (menuOpenBtn) menuOpenBtn.addEventListener('click', () => setMenuOpen(true));
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', () => setMenuOpen(false));
    if (menuBackdrop) menuBackdrop.addEventListener('click', () => setMenuOpen(false));
    drawerLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));

    // 3. Cycling Giant Hero Role (ENGINEER -> BUILDER -> DEVELOPER -> ARCHITECT)
    const roleEl = document.getElementById('cycling-role');
    const roles = ['ENGINEER', 'BUILDER', 'DEVELOPER', 'ARCHITECT'];
    let roleIdx = 0;

    if (roleEl) {
        setInterval(() => {
            roleEl.classList.add('fading');
            setTimeout(() => {
                roleIdx = (roleIdx + 1) % roles.length;
                roleEl.textContent = roles[roleIdx];
                roleEl.classList.remove('fading');
            }, 280);
        }, 2600);
    }

    // 4. Journey Switcher (ACHIEVEMENTS <-> EDUCATION)
    const switchTabs = document.querySelectorAll('.switch-tab');
    const journeyPanels = document.querySelectorAll('.journey-panel');

    switchTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            switchTabs.forEach((t) => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            journeyPanels.forEach((p) => p.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // 5. Copy Email in Bento Grid with Toast
    const copyBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');
    const email = 'laxmangaidhankar44@gmail.com';

    const showToast = (msg) => {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2400);
    };

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(email);
                showToast('Email copied to clipboard');
            } catch {
                showToast(email);
            }
        });
    }

    // 6. Dynamic Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
