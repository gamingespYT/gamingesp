/**
 * Gaming España - Menu Component
 * Modern Header with Glassmorphism & Improved Mobile Menu
 * Version 3.0
 */

document.addEventListener("DOMContentLoaded", function () {
    // ===================================
    // HEADER HTML TEMPLATE
    // ===================================
    const headerHTML = `
    <header class="header glass" id="header">
        <div class="header-container">
            <a href="index.html" class="header-logo">
                <img src="./img/logo.png" alt="Gaming España">
                <span class="header-brand">Gaming España</span>
            </a>
            
            <nav class="header-nav" id="nav">
                <ul class="nav-list">
                    <li><a href="index.html" class="nav-link" data-page="index">
                        <span class="nav-icon">🏠</span>
                        <span class="nav-text">Inicio</span>
                    </a></li>
                    <li><a href="mapas.html" class="nav-link" data-page="mapas">
                        <span class="nav-icon">🗺️</span>
                        <span class="nav-text">Mapas</span>
                    </a></li>
                    <li><a href="redes.html" class="nav-link" data-page="redes">
                        <span class="nav-icon">📱</span>
                        <span class="nav-text">Redes</span>
                    </a></li>
                    <li><a href="juegos.html" class="nav-link" data-page="juegos">
                        <span class="nav-icon">🎮</span>
                        <span class="nav-text">Juegos</span>
                    </a></li>
                    <li><a href="staff.html" class="nav-link nav-link-cta" data-page="staff">
                        <span class="nav-icon">👥</span>
                        <span class="nav-text">Staff</span>
                    </a></li>
                </ul>
                
                <!-- Mobile Footer in Nav -->
                <div class="nav-footer">
                    <div class="nav-socials">
                        <a href="https://www.youtube.com/@Gamingesp_YT" target="_blank" rel="noopener" aria-label="YouTube">📺</a>
                        <a href="https://www.twitch.tv/gamingesp_twitch" target="_blank" rel="noopener" aria-label="Twitch">🎬</a>
                        <a href="https://discord.gg/42uecDVrPp" target="_blank" rel="noopener" aria-label="Discord">💬</a>
                        <a href="https://www.instagram.com/gamingesp_insta" target="_blank" rel="noopener" aria-label="Instagram">📷</a>
                    </div>
                    <p class="nav-copyright">© 2025 Gaming España</p>
                </div>
            </nav>
            
            <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
                <span class="hamburger">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </span>
            </button>
        </div>
    </header>
    `;

    // ===================================
    // HEADER CSS STYLES
    // ===================================
    const headerCSS = `
    /* Header Base */
    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: var(--z-fixed);
        padding: var(--space-md) 0;
        transition: all var(--transition-base);
    }
    
    .header.scrolled {
        background: rgba(10, 10, 15, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }
    
    .header-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 var(--space-lg);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    /* Logo */
    .header-logo {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        text-decoration: none;
        z-index: 10;
    }
    
    .header-logo img {
        width: 40px;
        height: 40px;
        object-fit: contain;
        transition: transform var(--transition-base);
    }
    
    .header-logo:hover img {
        transform: scale(1.1) rotate(5deg);
    }
    
    .header-brand {
        font-family: var(--font-heading);
        font-size: var(--text-lg);
        font-weight: 700;
        color: var(--color-text-primary);
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    /* Navigation Desktop */
    .header-nav {
        display: flex;
        align-items: center;
    }
    
    .nav-list {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        list-style: none;
        margin: 0;
        padding: 0;
    }
    
    .nav-link {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs);
        padding: var(--space-sm) var(--space-md);
        color: var(--color-text-secondary);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 500;
        text-decoration: none;
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
    }
    
    .nav-icon {
        display: none;
    }
    
    .nav-link:hover {
        color: var(--color-text-primary);
        background: rgba(255, 255, 255, 0.05);
    }
    
    .nav-link.active {
        color: var(--color-primary);
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 3px;
        background: var(--color-primary);
        border-radius: var(--radius-full);
    }
    
    .nav-link-cta {
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        color: var(--color-text-primary) !important;
        padding: var(--space-sm) var(--space-lg);
        border-radius: var(--radius-full);
        margin-left: var(--space-sm);
    }
    
    .nav-link-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px var(--color-primary-glow);
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    }
    
    .nav-link-cta.active::after {
        display: none;
    }
    
    .nav-footer {
        display: none;
    }
    
    /* Mobile Toggle */
    .nav-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: var(--space-sm);
        z-index: 10;
    }
    
    .hamburger {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 24px;
    }
    
    .hamburger-line {
        display: block;
        height: 2px;
        background: var(--color-text-primary);
        border-radius: var(--radius-full);
        transition: all var(--transition-base);
        transform-origin: center;
    }
    
    .hamburger-line:nth-child(1) { width: 100%; }
    .hamburger-line:nth-child(2) { width: 75%; }
    .hamburger-line:nth-child(3) { width: 50%; }
    
    .nav-toggle:hover .hamburger-line {
        width: 100%;
        background: var(--color-primary);
    }
    
    /* Mobile Toggle Active State */
    .nav-toggle.active .hamburger-line:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
    }
    
    .nav-toggle.active .hamburger-line:nth-child(2) {
        opacity: 0;
        transform: translateX(-10px);
    }
    
    .nav-toggle.active .hamburger-line:nth-child(3) {
        width: 100%;
        transform: translateY(-7px) rotate(-45deg);
    }
    
    /* =================================
       MOBILE STYLES - IMPROVED
       ================================= */
    @media (max-width: 768px) {
        .header-brand {
            display: none;
        }
        
        .nav-toggle {
            display: block;
        }
        
        .header-nav {
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            max-width: 300px;
            height: 100vh;
            height: 100dvh;
            background: linear-gradient(180deg, rgba(22, 22, 29, 0.98) 0%, rgba(10, 10, 15, 0.99) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-left: 1px solid var(--glass-border);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 0;
            z-index: 5;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        
        .header-nav.open {
            transform: translateX(0);
        }
        
        .nav-list {
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            padding: calc(70px + var(--space-lg)) var(--space-lg) var(--space-lg);
            flex: 1;
        }
        
        .nav-list li {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .nav-list li:last-child {
            border-bottom: none;
            margin-top: var(--space-md);
        }
        
        .nav-icon {
            display: block;
            font-size: 1.2rem;
            width: 32px;
            text-align: center;
        }
        
        .nav-link {
            padding: var(--space-lg) var(--space-md);
            font-size: var(--text-base);
            border-radius: 0;
            gap: var(--space-md);
        }
        
        .nav-link:hover {
            background: rgba(255, 77, 109, 0.1);
        }
        
        .nav-link.active {
            background: linear-gradient(90deg, rgba(255, 77, 109, 0.15) 0%, transparent 100%);
            border-left: 3px solid var(--color-primary);
            margin-left: -3px;
        }
        
        .nav-link.active::after {
            display: none;
        }
        
        .nav-link-cta {
            margin-left: 0;
            justify-content: center;
            padding: var(--space-md) var(--space-lg);
            border-radius: var(--radius-lg);
        }
        
        .nav-link-cta .nav-icon {
            display: none;
        }
        
        /* Mobile Nav Footer */
        .nav-footer {
            display: block;
            padding: var(--space-xl) var(--space-lg);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
        }
        
        .nav-socials {
            display: flex;
            justify-content: center;
            gap: var(--space-lg);
            margin-bottom: var(--space-md);
        }
        
        .nav-socials a {
            font-size: 1.5rem;
            text-decoration: none;
            transition: transform var(--transition-fast);
        }
        
        .nav-socials a:hover {
            transform: scale(1.2);
        }
        
        .nav-copyright {
            font-size: var(--text-xs);
            color: var(--color-text-muted);
            margin: 0;
        }
    }
    
    /* Extra small devices */
    @media (max-width: 360px) {
        .header-nav {
            max-width: 100%;
        }
        
        .nav-link {
            padding: var(--space-md);
        }
    }
    
    /* Overlay for mobile */
    .nav-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-base);
        z-index: 4;
        backdrop-filter: blur(4px);
    }
    
    .nav-overlay.visible {
        opacity: 1;
        visibility: visible;
    }
    `;

    // ===================================
    // COOKIE BANNER HTML
    // ===================================
    const bannerHTML = `
    <div id="cookie-banner" class="cookie-banner glass">
        <div class="cookie-content">
            <div class="cookie-text">
                <p>🍪 Utilizamos cookies y Google Analytics para mejorar tu experiencia.</p>
            </div>
            <div class="cookie-actions">
                <button id="accept-cookies" class="btn btn-primary btn-sm">Aceptar</button>
            </div>
        </div>
    </div>
    `;

    // ===================================
    // COOKIE BANNER CSS
    // ===================================
    const bannerCSS = `
    .cookie-banner {
        position: fixed;
        bottom: var(--space-lg);
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - var(--space-2xl));
        max-width: 600px;
        z-index: var(--z-modal);
        padding: var(--space-lg);
        border-radius: var(--radius-xl);
        animation: fadeInUp 0.5s ease forwards;
    }
    
    .cookie-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-lg);
    }
    
    .cookie-text p {
        margin: 0;
        font-size: var(--text-sm);
        color: var(--color-text-secondary);
    }
    
    .cookie-actions {
        flex-shrink: 0;
    }
    
    @media (max-width: 480px) {
        .cookie-banner {
            bottom: var(--space-md);
            width: calc(100% - var(--space-lg));
        }
        
        .cookie-content {
            flex-direction: column;
            text-align: center;
        }
        
        .cookie-actions {
            width: 100%;
        }
        
        .cookie-actions .btn {
            width: 100%;
        }
    }
    `;

    // ===================================
    // INSERT HTML & CSS
    // ===================================

    // Insert header
    document.body.insertAdjacentHTML("afterbegin", headerHTML);

    // Add overlay for mobile nav
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'nav-overlay';
    document.body.appendChild(overlay);

    // Create and insert styles
    const styleTag = document.createElement("style");
    styleTag.innerHTML = headerCSS + bannerCSS;
    document.head.appendChild(styleTag);

    // ===================================
    // HEADER FUNCTIONALITY
    // ===================================

    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Set active page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    navLinks.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });

    // Mobile menu toggle
    function toggleNav() {
        const isOpen = nav.classList.toggle('open');
        navToggle.classList.toggle('active');
        navOverlay.classList.toggle('visible');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeNav() {
        nav.classList.remove('open');
        navToggle.classList.remove('active');
        navOverlay.classList.remove('visible');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleNav);
    navOverlay.addEventListener('click', closeNav);

    // Close nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close nav on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeNav();
        }
    });

    // Header scroll effect
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ===================================
    // COOKIE CONSENT BANNER
    // ===================================

    // Cookie utility functions
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Cookie banner HTML
    const cookieBannerHTML = `
    <div class="cookie-banner" id="cookie-banner">
        <div class="cookie-content">
            <div class="cookie-icon">🍪</div>
            <div class="cookie-text">
                <h4>Usamos cookies</h4>
                <p>Este sitio usa cookies para mejorar tu experiencia y para Google Analytics. Al continuar navegando, aceptas su uso.</p>
            </div>
            <div class="cookie-actions">
                <button class="cookie-btn cookie-btn-accept" id="accept-cookies">Aceptar</button>
                <button class="cookie-btn cookie-btn-decline" id="decline-cookies">Rechazar</button>
            </div>
        </div>
    </div>
    `;

    // Cookie banner CSS
    const cookieBannerCSS = `
    .cookie-banner {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 40px);
        max-width: 900px;
        background: rgba(22, 22, 29, 0.98);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 20px 28px;
        z-index: 10000;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        animation: cookieSlideUp 0.5s ease;
    }
    
    @keyframes cookieSlideUp {
        from {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }

    .cookie-banner.hiding {
        animation: cookieSlideDown 0.4s ease forwards;
    }

    @keyframes cookieSlideDown {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
        }
    }

    .cookie-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: var(--space-lg);
        flex-wrap: wrap;
    }

    .cookie-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
    }

    .cookie-text {
        flex: 1;
        min-width: 200px;
    }

    .cookie-text h4 {
        font-family: var(--font-heading);
        font-size: var(--text-lg);
        margin-bottom: var(--space-xs);
        color: var(--color-text-primary);
    }

    .cookie-text p {
        font-size: var(--text-sm);
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.5;
    }

    .cookie-actions {
        display: flex;
        gap: var(--space-sm);
        flex-shrink: 0;
    }

    .cookie-btn {
        padding: var(--space-sm) var(--space-xl);
        border-radius: var(--radius-full);
        font-family: var(--font-heading);
        font-weight: 600;
        font-size: var(--text-sm);
        cursor: pointer;
        transition: all var(--transition-base);
        border: none;
    }

    .cookie-btn-accept {
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        color: white;
    }

    .cookie-btn-accept:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px var(--color-primary-glow);
    }

    .cookie-btn-decline {
        background: transparent;
        color: var(--color-text-secondary);
        border: 1px solid var(--glass-border);
    }

    .cookie-btn-decline:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--color-text-secondary);
    }

    @media (max-width: 768px) {
        .cookie-content {
            flex-direction: column;
            text-align: center;
        }

        .cookie-actions {
            width: 100%;
            justify-content: center;
        }

        .cookie-btn {
            flex: 1;
            max-width: 150px;
        }
    }
    `;

    // Inject cookie banner CSS
    const cookieStyleTag = document.createElement('style');
    cookieStyleTag.textContent = cookieBannerCSS;
    document.head.appendChild(cookieStyleTag);

    // Check if consent already given (cookie expires in 90 days = 3 months)
    const cookieConsent = getCookie('gaming_esp_cookie_consent');

    if (!cookieConsent) {
        // Show cookie banner
        document.body.insertAdjacentHTML('beforeend', cookieBannerHTML);

        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');

        function hideBanner() {
            banner.classList.add('hiding');
            setTimeout(() => banner.remove(), 400);
        }

        acceptBtn.addEventListener('click', () => {
            setCookie('gaming_esp_cookie_consent', 'accepted', 90); // 90 days = 3 months
            hideBanner();
            // Enable Google Analytics
            enableAnalytics();
        });

        declineBtn.addEventListener('click', () => {
            setCookie('gaming_esp_cookie_consent', 'declined', 90);
            hideBanner();
        });
    } else if (cookieConsent === 'accepted') {
        // User already accepted, enable analytics
        enableAnalytics();
    }

    // Function to enable Google Analytics
    function enableAnalytics() {
        // Google Analytics is already loaded via GTM, this just confirms consent
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'cookie_consent_given',
                'consent_type': 'analytics'
            });
        }
    }
});
