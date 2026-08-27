// ==========================================================================
// CBNU Research Group - Header & Footer (for index.html)
// ==========================================================================

function loadHeader() {
    return `
    <header class="header">
        <div class="header-top">
            <div class="container">
                <a href="index.html" class="logo-section">
                    <div class="project-logo">
                        <h1>CBNU DxH Research Group</h1>
                        <span class="subtitle">Data Mining &amp; Human-Computer Interaction</span>
                    </div>
                    <div class="university-logo">
                        <img src="assets/CBNU_logo.png" alt="충북대학교 로고">
                    </div>
                </a>
            </div>
        </div>

        <!-- Navigation (CBNU Research GNB Layout) -->
        <nav class="main-nav">
            <div class="container">
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="about/about.html">About</a>
                    </li>
                    <li class="nav-item">
                        <a href="people/people.html">People</a>
                    </li>
                    <li class="nav-item">
                        <a href="publications/publications.html">Publications</a>
                    </li>
                    <li class="nav-item">
                        <a href="community/notice.html">News</a>
                    </li>
                    <li class="nav-item">
                        <a href="community/news.html">Events</a>
                    </li>
                    <li class="nav-item">
                        <a href="community/gallery.html">Gallery</a>
                    </li>
                </ul>
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

function initComponentsIndex() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder && !headerPlaceholder.hasChildNodes()) {
        headerPlaceholder.innerHTML = loadHeader();
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder && !footerPlaceholder.hasChildNodes()) {
        footerPlaceholder.innerHTML = loadFooter();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponentsIndex);
} else {
    initComponentsIndex();
}

