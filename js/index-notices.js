// ==========================================================================
// CBNU Research Group - Index Page Dynamic Section Renderer
// ==========================================================================

function formatHomePubAuthors(authorsStr) {
    if (!authorsStr) return '';
    const officialMembersPattern = /\b(David Y\. Kang\*?|David Yoon Suk Kang\*?|Yoonsuk Kang\*?|강윤석\*?|Bogoan Kim[†\*]?|김보관\*?|Hojin Kim\*?|김호진\*?|Changu Lee\*?|이창우\*?|Seungjun Park\*?|박승준\*?|Sujin Yoon\*?|윤수진\*?|Minhyeok Kim\*?|김민혁\*?|Dong Hyeon Lee\*?|Donghyeon Lee\*?|이동현\*?|Dong Wook Lee\*?|이동욱\*?|Dayun Jeong\*?|정다윤\*?|Siwang Seo\*?|서시왕\*?)\b/g;
    return authorsStr.replace(officialMembersPattern, '<strong>$1</strong>');
}

function initializeIndexPage() {
    const isSubdir = window.location.pathname.includes('/about/') ||
                     window.location.pathname.includes('/community/') ||
                     window.location.pathname.includes('/people/') ||
                     window.location.pathname.includes('/publications/');
    const prefix = isSubdir ? '../' : '';

    // ── Recent Publications Showcase ──
    const pubList = document.getElementById('home-publications-list');
    if (pubList) {
        if (publicationsData && publicationsData.length > 0) {
            // Sort by year descending, then by id / original order
            const sortedPubs = [...publicationsData].sort((a, b) => {
                const yA = Number(a.year) || 0;
                const yB = Number(b.year) || 0;
                if (yB !== yA) return yB - yA;
                return (a.id || 0) - (b.id || 0);
            });
            const topPubs = sortedPubs.slice(0, 4);

            pubList.innerHTML = topPubs.map(p => `
                <li class="home-pub-item">
                    <span class="home-pub-year-badge">${p.year}</span>
                    <div class="home-pub-content">
                        <a href="${prefix}publications/publications.html" class="home-pub-title">
                            ${p.title}
                        </a>
                        <div class="home-pub-venue">${p.venue}</div>
                    </div>
                </li>
            `).join('');
        } else {
            pubList.innerHTML = '<li class="home-pub-item" style="color:#64748b;justify-content:center;padding:24px 0;">No publications registered yet.</li>';
        }
    }

    // ── News (Notices) ──
    const newsList = document.getElementById('home-news-list');
    if (newsList) {
        if (newsData && newsData.length > 0) {
            const sorted = [...newsData].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 4);
            newsList.innerHTML = sorted.map(n => `
                <li class="home-notice-item">
                    <span class="notice-badge ${n.isNew ? 'new' : ''}">${n.category || (n.isNew ? 'NEW' : 'News')}</span>
                    <a href="${prefix}community/notice-detail.html?id=${n.id}" class="notice-title">${n.title}</a>
                    <span class="notice-date">${n.date}</span>
                </li>
            `).join('');
        } else {
            newsList.innerHTML = '<li class="home-notice-item" style="color:#64748b;justify-content:center;padding:24px 0;">No news registered yet.</li>';
        }
    }

    // ── Events ──
    const eventsList = document.getElementById('home-events-list');
    if (eventsList) {
        if (eventsData && eventsData.length > 0) {
            const sorted = [...eventsData].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
            eventsList.innerHTML = sorted.map(n => `
                <li class="home-notice-item">
                    <span class="notice-badge">${n.category || 'Event'}</span>
                    <a href="${prefix}community/news-detail.html?id=${n.id}" class="notice-title">${n.title}</a>
                    <span class="notice-date">${n.date}</span>
                </li>
            `).join('');
        } else {
            eventsList.innerHTML = '<li class="home-notice-item" style="color:#64748b;justify-content:center;padding:24px 0;">No events registered yet.</li>';
        }
    }

    // ── Gallery ──
    const galleryGrid = document.getElementById('home-gallery-grid');
    if (galleryGrid) {
        if (galleryData && galleryData.length > 0 && galleryData.some(g => g.thumbnail || g.image)) {
            const validPhotos = galleryData.filter(g => g.thumbnail || g.image);
            const sorted = [...validPhotos].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
            galleryGrid.innerHTML = sorted.map(g => {
                const rawPath = g.thumbnail || g.image || '';
                const cleanImgPath = isSubdir
                    ? (rawPath.startsWith('../') ? rawPath : `../${rawPath}`)
                    : rawPath.replace(/^\.\.\//, '');
                return `
                <a href="${prefix}community/gallery.html" class="home-gallery-item">
                    ${g.date ? `<span class="home-gallery-date-badge">${g.date}</span>` : ''}
                    <img src="${cleanImgPath}" alt="${g.title || 'Lab Photo'}" loading="lazy">
                    <div class="home-gallery-overlay">
                        <h4 class="home-gallery-title">${g.title || 'Lab Photo'}</h4>
                    </div>
                </a>
            `}).join('');
        } else {
            galleryGrid.innerHTML = `
                <div class="gallery-empty-state" style="grid-column: 1 / -1; padding: 40px 24px; text-align: center; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; color: #64748b;">
                    <span class="material-symbols-outlined" style="font-size: 36px; color: #94a3b8; display: block; margin-bottom: 8px;">photo_library</span>
                    <p style="margin: 0; font-size: 14px; font-weight: 500;">No gallery photos yet. Lab activity photos will be updated soon.</p>
                </div>
            `;
        }
    }
}

window.addEventListener('dataLoaded', initializeIndexPage);

if (typeof publicationsData !== 'undefined' && publicationsData.length > 0) {
    initializeIndexPage();
}
