
function applyTheme() {
    const logoContainer = document.getElementById('logo-container');
    const logoLink = document.getElementById('logo-link');
    
    if (logoContainer) {
        if (config.site.logoType === 'text') {
            logoContainer.innerHTML = `<i class="bi bi-reception-3"></i>
                                      <span class="logo-text">${config.site.logoText}</span>`;
        } else if (config.site.logoType === 'image') {
            logoContainer.innerHTML = `<img src="${config.site.logoImage}" alt="Logo" class="logo-image">`;
            applyCustomStyles('.logo-image', `
                height: 36px;
                max-width: 200px;
                object-fit: contain;
                transition: background-color 0.15s ease;
            `);
        }
    }
    
    if (logoLink) {
        logoLink.href = config.site.logoLink;
    }
    
    applyFavicon();
    
    if (config.site.siteName) {
        document.title = config.site.siteName;
    }
    
    applyThemeColors();
    applyEnhancedUI();
}

function applyFavicon() {
    if (config.site.favicon) {
        const faviconStandard = document.getElementById('favicon-standard');
        const faviconShortcut = document.getElementById('favicon-shortcut');
        
        if (faviconStandard) {
            faviconStandard.href = config.site.favicon;
        }
        
        if (faviconShortcut) {
            faviconShortcut.href = config.site.favicon;
        }
        
        const link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = config.site.favicon;
        document.head.appendChild(link);
    }
}

function applyThemeColors() {
    const themeStyle = document.createElement('style');
    themeStyle.textContent = `
        :root {
            --bg-color: ${config.theme.bgColor};
            --header-bg: ${hexToRgba(config.theme.bgColor, 0.8)};
            --card-bg: ${config.theme.cardBg};
            --card-hover: ${config.theme.cardHover};
            --text-color: ${config.theme.textColor};
            --text-secondary: ${config.theme.textSecondary};
            --text-tertiary: ${config.theme.textTertiary};
            --border-color: ${config.theme.borderColor};
            --operational-color: ${config.theme.operationalColor};
            --operational-bg: ${hexToRgba(config.theme.operationalColor, 0.1)};
            --warning-color: ${config.theme.warningColor};
            --warning-bg: ${hexToRgba(config.theme.warningColor, 0.1)};
            --down-color: ${config.theme.downColor};
            --down-bg: ${hexToRgba(config.theme.downColor, 0.1)};
            --primary-color: ${config.theme.primaryColor};
            --primary-gradient: ${config.theme.primaryGradient};
            --blue-color: ${config.theme.blueColor};
            --blue-bg: ${hexToRgba(config.theme.blueColor, 0.1)};
            --border-radius: ${config.theme.borderRadius};
            --card-radius: ${config.theme.cardRadius};
            --shadow: ${config.theme.shadow};
        }
    `;
    
    document.head.appendChild(themeStyle);
}

function applyEnhancedUI() {
    applyCustomStyles('body', `
        background-image: linear-gradient(to bottom, ${hexToRgba(config.theme.bgColor, 0.9)}, ${config.theme.bgColor});
        background-attachment: fixed;
    `);

    applyCustomStyles('.metric-card, .service-category, .timeline-section', `
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        transition: background-color 0.15s ease;
        border: 1px solid ${hexToRgba(config.theme.borderColor, 0.5)};
        backdrop-filter: blur(10px);
    `);
    
    applyCustomStyles('.metric-card:hover, .service-category:hover, .timeline-section:hover', `
        background-color: ${hexToRgba(config.theme.cardHover, 0.5)};
    `);
    
    applyCustomStyles('.status-banner', `
        backdrop-filter: blur(10px);
        border: 1px solid ${hexToRgba(config.theme.borderColor, 0.5)};
        transition: none;
    `);
    
    applyCustomStyles('.metric-icon', `
        transition: background-color 0.15s ease;
    `);
    
    applyCustomStyles('.status-indicator', `
        transition: background-color 0.15s ease;
    `);
    
    applyCustomStyles('header', `
        backdrop-filter: blur(15px);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    `);
    
    applyCustomStyles('nav ul li a', `
        transition: color 0.3s ease;
    `);
    
    applyCustomStyles('.timeline-item', `
        transition: background-color 0.3s ease;
    `);
    
    applyCustomStyles('.timeline-item:hover', `
        background-color: ${hexToRgba(config.theme.cardHover, 0.5)};
    `);
    
    applyCustomStyles('.service-item', `
        transition: background-color 0.3s ease;
    `);
    
    applyCustomStyles('.service-item:hover', `
        background-color: ${hexToRgba(config.theme.cardHover, 0.8)};
    `);
}

function applyCustomStyles(selector, stylesCSS) {
    const styleEl = document.createElement('style');
    styleEl.textContent = `${selector} { ${stylesCSS} }`;
    document.head.appendChild(styleEl);
}

function hexToRgba(hex, alpha = 1) {
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

document.addEventListener('DOMContentLoaded', function() {
    applyTheme();
});