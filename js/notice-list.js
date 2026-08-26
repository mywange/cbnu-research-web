// ==========================================================================
// CBNU Research Group - News (Notice) List
// ==========================================================================

const itemsPerPage = 10;
let currentPage = 1;

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

    const sorted = [...newsData].sort((a, b) => (b.id || 0) - (a.id || 0));
    displayNotices(currentPage, sorted);
    displayPagination(sorted);
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

    container.innerHTML = pageItems.map(item => `
        <div class="notice-row">
            <div class="notice-num">
                ${item.isNew ? '<span class="badge-new">NEW</span>' : item.id}
            </div>
            <div class="notice-subject">
                <a href="notice-detail.html?id=${item.id}">${item.title}</a>
            </div>
            <div class="notice-author">${item.category || item.author || 'Admin'}</div>
            <div class="notice-date-col">${item.date}</div>
        </div>
    `).join('');
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
    const sorted = [...newsData].sort((a, b) => (b.id || 0) - (a.id || 0));
    displayNotices(currentPage, sorted);
    displayPagination(sorted);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('dataLoaded', loadNotices);

if (typeof newsData !== 'undefined' && newsData.length > 0) {
    loadNotices();
}
