const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');
const themeToggle = document.querySelector('.theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const htmlElement = document.documentElement;
const heroSection = document.querySelector('.journal-hero');

function setMenuOpen(isOpen) {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        setMenuOpen(!navLinks.classList.contains('active'));
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            setMenuOpen(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            setMenuOpen(false);
        }
    });
}

const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (!sunIcon || !moonIcon) return;
    const isDark = theme === 'dark';
    sunIcon.style.display = isDark ? 'block' : 'none';
    moonIcon.style.display = isDark ? 'none' : 'block';
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    });
});

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightActiveSection() {
    if (!sections.length || !navItems.length) return;

    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach((item) => {
                item.classList.toggle('active', item.getAttribute('href') === `#${sectionId}`);
            });
        }
    });
}

function updateNavbarState() {
    if (!navbar) return;

    const scrollY = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;

    navbar.classList.toggle('navbar--solid', scrollY > 48);
    navbar.classList.toggle('navbar--overlay', heroSection && scrollY < heroHeight - 80);
}

window.addEventListener('scroll', () => {
    highlightActiveSection();
    updateNavbarState();
}, { passive: true });

window.addEventListener('load', () => {
    highlightActiveSection();
    updateNavbarState();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const revealTargets = document.querySelectorAll(
        '.journal-section__header, .journal-about__layout, .work-entry, .journal-contact__panel'
    );

    revealTargets.forEach((el) => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
}

const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');
const emailForm = document.getElementById('emailForm');

if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', function () {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        charCount.style.color = currentLength >= 450 ? 'var(--color-accent-deep)' : '';
    });
}

if (emailForm) {
    emailForm.addEventListener('submit', function (e) {
        e.preventDefault();
        this.reset();
        if (charCount) charCount.textContent = '0';
    });
}
