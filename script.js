// ==========================================================================
// CBNU Research Group - Global Utilities & Interactive Behaviors
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for in-page anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (!href || href === '#') {
                e.preventDefault();
                return;
            }

            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (mobileMenuToggle) {
                            mobileMenuToggle.classList.remove('active');
                            const spans = mobileMenuToggle.querySelectorAll('span');
                            spans[0].style.transform = 'none';
                            spans[1].style.opacity = '1';
                            spans[2].style.transform = 'none';
                        }
                    }

                    // Smooth scroll to target
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } catch (err) {
                // Ignore invalid CSS selector in href
            }
        });
    });

    // Animate elements on scroll
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.feature-card, .home-card, .pub-entry');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Handle window resize to reset mobile menu on desktop width
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    if (spans.length >= 3) {
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                }
            }
        }, 200);
    });
});

// Utility: Throttle
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Scroll to Top Floating Button
function createScrollToTopButton() {
    if (document.querySelector('.scroll-to-top')) return;

    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Scroll to top of page');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: var(--primary-color, #b92555);
        color: white;
        border: none;
        font-size: 22px;
        font-weight: 700;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.2s ease, background-color 0.2s ease;
        z-index: 999;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 350) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    }, 150));

    button.addEventListener('mouseenter', function() {
        button.style.transform = 'scale(1.08)';
    });

    button.addEventListener('mouseleave', function() {
        button.style.transform = 'none';
    });

    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize floating back-to-top
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createScrollToTopButton);
} else {
    createScrollToTopButton();
}
