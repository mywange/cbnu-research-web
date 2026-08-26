// ==========================================================================
// CBNU Research Group - News (Notice) List
// ==========================================================================

const itemsPerPage = 10;
let currentPage = 1;

function sortNotices(data) {
    return [...data].sort((a, b) => {
        const dateA = String(a.date || '');
        const dateB = String(b.date || '');
        if (dateB !== dateA) return dateB.localeCompare(dateA);
        return (b.id || 0) - (a.id || 0);
    });
}

function loadNotices() {
    const container = document.getElementById('notice-list');
    if (!container) return;

    if (!newsData || newsData.length === 0) {
        container.innerHTML = `
            <div class="notice-row" style="display: block; text-align: center; padding: 40px; color: #999; grid-column: 1 / -1;">
                No news registered yet.
            </div>
        `;
        return;
    }

    const sorted = sortNotices(newsData);
    displayNotices(currentPage, sorted);
    displayPagination(sorted);
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

function displayNotices(page, sorted) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = sorted.slice(startIndex, endIndex);

    const container = document.getElementById('notice-list');
    if (!container) return;

    if (pageItems.length === 0) {
        container.innerHTML = `
            <div class="notice-row" style="display: block; text-align: center; padding: 40px; color: #999; grid-column: 1 / -1;">
                No news registered yet.
            </div>
        `;
        return;
    }

    container.innerHTML = pageItems.map((item, idx) => {
        const rowNum = sorted.length - (startIndex + idx);
        return `
        <div class="notice-row">
            <div class="notice-num">
                ${rowNum}
            </div>
            <div class="notice-subject">
                <a href="notice-detail.html?id=${item.id}">${item.title}</a>
            </div>
            <div class="notice-author">Admin</div>
            <div class="notice-date-col">${formatYearMonth(item.date)}</div>
        </div>
    `}).join('');
}

function displayPagination(sorted) {
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const container = document.getElementById('pagination');
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    if (currentPage > 1)
        html += `<a href="#" class="page-link-btn" onclick="changeNoticePage(${currentPage - 1}); return false;">&laquo;</a>`;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
        html += `<a href="#" class="page-link-btn ${i === currentPage ? 'active' : ''}" onclick="changeNoticePage(${i}); return false;">${i}</a>`;
    }

    if (currentPage < totalPages)
        html += `<a href="#" class="page-link-btn" onclick="changeNoticePage(${currentPage + 1}); return false;">&raquo;</a>`;

    container.innerHTML = html;
}

function changeNoticePage(page) {
    currentPage = page;
    const sorted = sortNotices(newsData);
    displayNotices(currentPage, sorted);
    displayPagination(sorted);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('dataLoaded', loadNotices);

if (typeof newsData !== 'undefined' && newsData.length > 0) {
    loadNotices();
}
