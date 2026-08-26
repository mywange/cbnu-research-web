// ==========================================================================
// CBNU Research Group - Publications Interactive List
// ==========================================================================

let currentCategory = 'all';
let currentLab = 'all';
let currentSearchQuery = '';

function formatAuthors(authorsStr) {
    if (!authorsStr) return '';
    // Highlight ONLY official CBNU Research Group People (Faculty, M.S. Students, Undergraduate Students)
    const officialMembersPattern = /\b(David Y\. Kang\*?|David Yoon Suk Kang\*?|Yoonsuk Kang\*?|강윤석\*?|Bogoan Kim[†\*]?|B Kim[†\*]?|김보관\*?|Hojin Kim\*?|김호진\*?|Changu Lee\*?|C Lee\*?|이창우\*?|Seungjun Park\*?|박승준\*?|Sujin Yoon\*?|윤수진\*?|Minhyeok Kim\*?|김민혁\*?|Dong Hyeon Lee\*?|Donghyeon Lee\*?|이동현\*?|Dong Wook Lee\*?|이동욱\*?|Dayoung Jeong\*?|Dayun Jeong\*?|D Jeong\*?|정다윤\*?|Siwang Seo\*?|서시왕\*?)\b/g;

    return authorsStr.replace(officialMembersPattern, '<strong>$1</strong>');
}

function renderLinkButtons(links) {
    if (!links || Object.keys(links).length === 0) return '';

    const buttonConfigs = [
        { key: 'pdf', label: 'PDF', icon: 'picture_as_pdf', class: 'pub-link-pdf' },
        { key: 'doi', label: 'DOI', icon: 'link', class: 'pub-link-doi' },
        { key: 'acm', label: 'ACM DL', icon: 'menu_book', class: 'pub-link-dl' },
        { key: 'ieee', label: 'IEEE DL', icon: 'menu_book', class: 'pub-link-dl' },
        { key: 'arxiv', label: 'arXiv', icon: 'description', class: 'pub-link-arxiv' },
        { key: 'talk', label: 'Talk', icon: 'play_circle', class: 'pub-link-media' },
        { key: 'slides', label: 'Slides', icon: 'co_present', class: 'pub-link-media' },
        { key: 'demo', label: 'Demo', icon: 'smart_display', class: 'pub-link-media' },
        { key: 'media', label: 'Media', icon: 'newspaper', class: 'pub-link-media' }
    ];

    let html = '<div class="pub-links-bar">';
    buttonConfigs.forEach(cfg => {
        if (links[cfg.key]) {
            html += `
                <a href="${links[cfg.key]}" target="_blank" rel="noopener noreferrer" class="pub-btn ${cfg.class}">
                    <span class="material-symbols-outlined pub-btn-icon">${cfg.icon}</span>
                    <span>${cfg.label}</span>
                </a>
            `;
        }
    });
    html += '</div>';
    return html;
}

function matchesCategory(item, cat) {
    if (cat === 'all') return true;
    const itemScope = String(item.scope || '').toLowerCase();
    const itemCat = String(item.category || '').toLowerCase();

    if (cat === 'int-conf') {
        return (itemScope === 'intl' || itemScope === 'international') && (itemCat === 'conf' || itemCat === 'conference');
    }
    if (cat === 'int-journal') {
        return (itemScope === 'intl' || itemScope === 'international') && (itemCat === 'journal');
    }
    if (cat === 'preprint') {
        return itemCat === 'preprint';
    }
    if (cat === 'domestic') {
        return itemScope === 'domestic' || itemCat === 'domestic';
    }
    return true;
}

function matchesLab(item, lab) {
    if (lab === 'all') return true;
    const itemLab = String(item.lab || '').toLowerCase();
    if (lab === 'hai' || lab === 'hci') {
        return itemLab.includes('hai') || itemLab.includes('hci');
    }
    if (lab === 'dm') {
        return itemLab.includes('dm');
    }
    return true;
}

function renderPublications() {
    const container = document.getElementById('publications-container');
    const countContainer = document.getElementById('pub-count-display');
    if (!container) return;

    if (!publicationsData || publicationsData.length === 0) {
        container.innerHTML = `
            <div class="pub-empty-state">
                <span class="material-symbols-outlined" style="font-size: 48px; color: #9aa0a6;">library_books</span>
                <p>Loading publications...</p>
            </div>
        `;
        return;
    }

    // Filter data
    const filtered = publicationsData.filter(item => {
        // Category filter
        if (!matchesCategory(item, currentCategory)) return false;

        // Lab filter
        if (!matchesLab(item, currentLab)) return false;

        // Search query
        if (currentSearchQuery.trim() !== '') {
            const query = currentSearchQuery.toLowerCase();
            const titleMatch = (item.title || '').toLowerCase().includes(query);
            const authorsMatch = (item.authors || '').toLowerCase().includes(query);
            const venueMatch = (item.venue || '').toLowerCase().includes(query);
            const awardMatch = (item.award || '').toLowerCase().includes(query);
            const rankMatch = (item.rank || '').toLowerCase().includes(query);
            const labMatch = (item.lab || '').toLowerCase().includes(query);
            const yearMatch = String(item.year || '').includes(query);
            if (!titleMatch && !authorsMatch && !venueMatch && !awardMatch && !rankMatch && !labMatch && !yearMatch) {
                return false;
            }
        }

        return true;
    });

    // Update count display
    if (countContainer) {
        countContainer.textContent = `Showing ${filtered.length} publication${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="pub-empty-state">
                <span class="material-symbols-outlined" style="font-size: 48px; color: #9aa0a6;">search_off</span>
                <p>No publications found matching the selected criteria.</p>
                <button class="btn btn-secondary" onclick="resetPubFilters()" style="margin-top: 12px;">Reset Filters</button>
            </div>
        `;
        return;
    }

    // Group by Year
    const yearsMap = new Map();
    filtered.forEach(item => {
        const y = item.year || 'Other';
        if (!yearsMap.has(y)) {
            yearsMap.set(y, []);
        }
        yearsMap.get(y).push(item);
    });

    // Sort years descending
    const sortedYears = Array.from(yearsMap.keys()).sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') return b - a;
        return String(b).localeCompare(String(a));
    });

    let html = '';
    sortedYears.forEach(year => {
        const itemsInYear = yearsMap.get(year);
        html += `
            <section class="pub-year-section" id="pub-year-${year}">
                <div class="pub-year-header">
                    <h2 class="pub-year-heading">${year}</h2>
                    <span class="pub-year-count">${itemsInYear.length} Paper${itemsInYear.length === 1 ? '' : 's'}</span>
                </div>
                <div class="pub-list-group">
        `;

        itemsInYear.forEach(item => {
            const labName = item.lab || '';
            const labUpper = labName.toUpperCase();
            const labClass = (labUpper.includes('HAI') || labUpper.includes('HCI')) && labUpper.includes('DM')
                ? 'badge-joint'
                : (labUpper.includes('HAI') || labUpper.includes('HCI') ? 'badge-hci' : (labUpper.includes('DM') ? 'badge-dm' : 'badge-joint'));

            const awardBadge = item.award ? `<span class="pub-badge award-badge">🏅 ${item.award}</span>` : '';
            const rankBadge = item.rank ? `<span class="pub-badge rank-badge">⭐ ${item.rank}</span>` : '';
            const labBadge = labName ? `<span class="pub-badge ${labClass}">${labName}</span>` : '';
            
            const isDomestic = String(item.scope || '').toLowerCase() === 'domestic' || String(item.category || '').toLowerCase() === 'domestic';
            const scopeBadge = isDomestic ? `<span class="pub-badge badge-domestic">Domestic</span>` : '';

            html += `
                <article class="pub-entry" data-category="${item.category}" data-scope="${item.scope}" data-lab="${item.lab}">
                    <div class="pub-body">
                        <div class="pub-header-line">
                            <h3 class="pub-title">${item.title}</h3>
                        </div>
                        <div class="pub-badges-wrap">
                            ${awardBadge}
                            ${rankBadge}
                            ${labBadge}
                            ${scopeBadge}
                        </div>
                        <p class="pub-authors">${formatAuthors(item.authors)}</p>
                        <p class="pub-venue">${item.venue}</p>
                        ${renderLinkButtons(item.links)}
                    </div>
                </article>
            `;
        });

        html += `
                </div>
            </section>
        `;
    });

    container.innerHTML = html;
}

function resetPubFilters() {
    currentCategory = 'all';
    currentLab = 'all';
    currentSearchQuery = '';

    const searchInput = document.getElementById('pub-search-input');
    if (searchInput) searchInput.value = '';

    const catButtons = document.querySelectorAll('.pub-category-tabs .tab-btn');
    catButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === 'all');
    });

    const labSelect = document.getElementById('pub-lab-select');
    if (labSelect) labSelect.value = 'all';

    renderPublications();
}

function setupPubEventHandlers() {
    // Category Tabs
    const catButtons = document.querySelectorAll('.pub-category-tabs .tab-btn');
    catButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            catButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-target') || 'all';
            renderPublications();
        });
    });

    // Lab Select / Filter
    const labSelect = document.getElementById('pub-lab-select');
    if (labSelect) {
        labSelect.addEventListener('change', function () {
            currentLab = this.value;
            renderPublications();
        });
    }

    // Search input
    const searchInput = document.getElementById('pub-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            currentSearchQuery = this.value;
            renderPublications();
        });
    }
}

window.addEventListener('dataLoaded', function () {
    renderPublications();
    setupPubEventHandlers();
});

// If data is already loaded before this script runs
if (typeof publicationsData !== 'undefined' && publicationsData.length > 0) {
    renderPublications();
    setupPubEventHandlers();
}
