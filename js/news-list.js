// ==========================================================================
// CBNU Research Group - Events List
// ==========================================================================

let currentEventsPage = 1;
const eventsPerPage = 10;

function sortEvents(data) {
    return [...data].sort((a, b) => {
        const dateA = String(a.date || '');
        const dateB = String(b.date || '');
        if (dateB !== dateA) return dateB.localeCompare(dateA);
        return (b.id || 0) - (a.id || 0);
    });
}

function loadEvents() {
    const tableContainer = document.getElementById('events-list');
    const cardContainer = document.getElementById('news-list');
    const container = tableContainer || cardContainer;

    if (!container) return;

    if (!eventsData || eventsData.length === 0) {
        container.innerHTML = `
            <div class="notice-row" style="display: block; text-align: center; padding: 40px; color: #999; grid-column: 1 / -1;">
                No events registered yet.
            </div>
        `;
        return;
    }

    const sorted = sortEvents(eventsData);
    displayEvents(currentEventsPage, sorted);
    displayEventsPagination(sorted);
}

function formatYearMonth(dateStr) {
    if (!dateStr) return '-';
    const cleaned = String(dateStr).trim().replace(/-/g, '.');
    const parts = cleaned.split('.');
    if (parts.length >= 2) {
        return `${parts[0]}.${parts[1]}`;
    }
    return cleaned;
}

function displayEvents(page, sorted) {
    const tableContainer = document.getElementById('events-list');
    const cardContainer = document.getElementById('news-list');
    const container = tableContainer || cardContainer;
    if (!container) return;

    const startIndex = (page - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const pageItems = sorted.slice(startIndex, endIndex);

    if (pageItems.length === 0) {
        container.innerHTML = `
            <div class="notice-row" style="display: block; text-align: center; padding: 40px; color: #999; grid-column: 1 / -1;">
                No events registered yet.
            </div>
        `;
        return;
    }

    if (tableContainer) {
        container.innerHTML = pageItems.map((item, idx) => {
            const rowNum = sorted.length - (startIndex + idx);
            return `
            <div class="notice-row">
                <div class="notice-num">
                    ${rowNum}
                </div>
                <div class="notice-subject">
                    <a href="news-detail.html?id=${item.id}">${item.title}</a>
                </div>
                <div class="notice-author">Admin</div>
                <div class="notice-date-col">${formatYearMonth(item.date)}</div>
            </div>
        `}).join('');
    } else {
        container.innerHTML = pageItems.map(item => `
            <article class="news-item-page">
                ${item.thumbnail ? `
                <div class="news-thumbnail">
                    <a href="news-detail.html?id=${item.id}">
                        <img src="${item.thumbnail}" alt="${item.title}">
                    </a>
                </div>` : ''}
                <div class="news-info">
                    <h3><a href="news-detail.html?id=${item.id}">${item.title}</a></h3>
                    <p class="news-summary">${item.summary || ''}</p>
                    <div class="news-meta">
                        <span class="news-date">${formatYearMonth(item.date)}</span>
                        <span class="news-author">Source: ${item.author || 'Admin'}</span>
                    </div>
                </div>
            </article>
        `).join('');
    }
}

function displayEventsPagination(sorted) {
    const container = document.getElementById('pagination') || document.getElementById('news-pagination');
    if (!container) return;

    const totalPages = Math.ceil(sorted.length / eventsPerPage);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    if (currentEventsPage > 1)
        html += `<a href="#" class="page-link-btn" onclick="changeEventsPage(${currentEventsPage - 1}); return false;">&laquo;</a>`;

    const startPage = Math.max(1, currentEventsPage - 2);
    const endPage = Math.min(totalPages, currentEventsPage + 2);
    for (let i = startPage; i <= endPage; i++) {
        html += `<a href="#" class="page-link-btn ${i === currentEventsPage ? 'active' : ''}" onclick="changeEventsPage(${i}); return false;">${i}</a>`;
    }

    if (currentEventsPage < totalPages)
        html += `<a href="#" class="page-link-btn" onclick="changeEventsPage(${currentEventsPage + 1}); return false;">&raquo;</a>`;

    container.innerHTML = html;
}

function changeEventsPage(page) {
    currentEventsPage = page;
    const sorted = sortEvents(eventsData);
    displayEvents(currentEventsPage, sorted);
    displayEventsPagination(sorted);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('dataLoaded', loadEvents);

if (typeof eventsData !== 'undefined' && eventsData.length > 0) {
    loadEvents();
}
