// ==========================================================================
// CBNU Research Group - Header & Footer (for subpages)
// ==========================================================================

function loadHeader() {
    const currentPath = window.location.pathname;

    const isAbout = currentPath.includes('/about/');
    const isPublications = currentPath.includes('/publications/');
    const isPeople = currentPath.includes('/people/');
    const isNotice = currentPath.includes('/community/notice') || currentPath.includes('/community/notice-detail');
    const isNews = currentPath.includes('/community/news') || currentPath.includes('/community/news-detail');
    const isGallery = currentPath.includes('/community/gallery');

    return `
    <header class="header">
        <div class="header-top">
            <div class="container">
                <a href="../index.html" class="logo-section">
                    <div class="project-logo">
                        <h1>CBNU DxH Research Group</h1>
                        <span class="subtitle">Data Mining &amp; Human-Computer Interaction</span>
                    </div>
                    <div class="university-logo">
                        <img src="../assets/CBNU_logo.png" alt="충북대학교 로고">
                    </div>
                </a>
            </div>
        </div>

        <!-- Navigation (CBNU Research GNB Layout) -->
        <nav class="main-nav">
            <div class="container">
                <ul class="nav-menu">
                    <li class="nav-item ${isAbout ? 'active' : ''}">
                        <a href="../about/about.html">About</a>
                    </li>
                    <li class="nav-item ${isPublications ? 'active' : ''}">
                        <a href="../publications/publications.html">Publications</a>
                    </li>
                    <li class="nav-item ${isPeople ? 'active' : ''}">
                        <a href="../people/people.html">People</a>
                    </li>
                    <li class="nav-item ${isNotice ? 'active' : ''}">
                        <a href="../community/notice.html">News</a>
                    </li>
                    <li class="nav-item ${isNews ? 'active' : ''}">
                        <a href="../community/news.html">Events</a>
                    </li>
                    <li class="nav-item ${isGallery ? 'active' : ''}">
                        <a href="../community/gallery.html">Gallery</a>
                    </li>
                </ul>
                <button class="mobile-menu-toggle" aria-label="Toggle navigation menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    </header>
    `;
}

function loadFooter() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <h3>CBNU DxH Research Group</h3>
                    <p>Chungbuk National University • School of Computer Science &amp; School of Information and Communication Engineering</p>
                    <p>Location: 1 Chungdae-ro, Seowon-gu, Cheongju-si, Chungcheongbuk-do</p>
                    <p style="margin-top: 4px;">Administrator: ssw51112@chungbuk.ac.kr</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 CBNU DxH Research Group. All rights reserved.</p>
                <p>Chungbuk National University</p>
            </div>
        </div>
    </footer>
    `;
}

document.addEventListener('DOMContentLoaded', function () {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = loadHeader();
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = loadFooter();
    }

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');

            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.main-nav') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});
