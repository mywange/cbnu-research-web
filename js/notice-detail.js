// ==========================================================================
// CBNU Research Group - News (Notice) Detail Controller
// ==========================================================================

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getNoticeIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function loadNoticeDetail() {
    const noticeId = getNoticeIdFromURL();

    if (!noticeId) {
        displayError('Invalid post ID or missing parameter.');
        return;
    }

    if (!newsData || newsData.length === 0) {
        displayError('Could not load news data. Please try again later.');
        return;
    }

    const notice = newsData.find(n => String(n.id) === String(noticeId));

    if (!notice) {
        displayError(`Post #${noticeId} could not be found or has been removed.`);
        return;
    }

    displayNoticeDetail(notice);
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

function displayNoticeDetail(notice) {
    // Set Header Metadata
    const titleEl = document.getElementById('notice-title');
    const categoryEl = document.getElementById('notice-category');
    const newBadgeEl = document.getElementById('notice-new-badge');
    const authorEl = document.getElementById('notice-author');
    const dateEl = document.getElementById('notice-date');
    const contentEl = document.getElementById('notice-content');

    if (titleEl) titleEl.textContent = notice.title;
    if (categoryEl) categoryEl.textContent = notice.category || 'News';
    if (authorEl) authorEl.textContent = notice.author || 'Admin';
    if (dateEl) dateEl.textContent = formatYearMonth(notice.date);

    if (newBadgeEl) {
        newBadgeEl.style.display = notice.isNew ? 'inline-block' : 'none';
    }

    // Markdown Content Parsing
    const raw = notice.content || notice.summary || '';
    let contentHtml = typeof marked !== 'undefined'
        ? marked.parse(raw)
        : raw.replace(/\n/g, '<br>');

    // Optional: If there is a thumbnail image specified in frontmatter
    if (notice.thumbnail) {
        const safeThumb = escapeHTML(notice.thumbnail);
        const safeTitle = escapeHTML(notice.title || '');
        contentHtml = `
            <div class="post-featured-thumbnail" style="margin-bottom: 24px; text-align: center;">
                <img src="${safeThumb}" alt="${safeTitle}" style="max-width: 100%; border-radius: 10px; box-shadow: 0 4px 18px rgba(0,0,0,0.06);">
            </div>
            ${contentHtml}
        `;
    }

    if (contentEl) {
        contentEl.innerHTML = contentHtml;
    }

    // Attachments Handling
    const existingAttachments = document.querySelector('.notice-attachments');
    if (existingAttachments) existingAttachments.remove();

    if (notice.attachments && Array.isArray(notice.attachments) && notice.attachments.length > 0) {
        const attachmentsHtml = `
            <div class="notice-attachments">
                <h3><span class="material-symbols-outlined" style="font-size: 19px; color: var(--primary-color);">attach_file</span> Attachments</h3>
                <ul class="attachment-list">
                    ${notice.attachments.map(file => {
                        const safeUrl = escapeHTML(file.url || '#');
                        const safeName = escapeHTML(file.name || 'Download File');
                        return `
                        <li class="attachment-item">
                            <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" download>
                                <span class="material-symbols-outlined" style="font-size: 17px;">description</span>
                                <span class="file-name">${safeName}</span>
                            </a>
                        </li>
                    `}).join('')}
                </ul>
            </div>
        `;
        const footerEl = document.querySelector('.post-detail-footer');
        if (footerEl) {
            footerEl.insertAdjacentHTML('beforebegin', attachmentsHtml);
        }
    }

    document.title = `${notice.title} - CBNU DxH Research Group`;
}

function displayError(message) {
    const titleEl = document.getElementById('notice-title');
    const authorEl = document.getElementById('notice-author');
    const dateEl = document.getElementById('notice-date');
    const contentEl = document.getElementById('notice-content');

    if (titleEl) titleEl.textContent = 'Post Not Found';
    if (authorEl) authorEl.textContent = '-';
    if (dateEl) dateEl.textContent = '-';
    if (contentEl) {
        contentEl.innerHTML = `
            <div class="post-fallback-box">
                <span class="material-symbols-outlined post-fallback-icon">error_outline</span>
                <h3 class="post-fallback-title">404 - Content Unavailable</h3>
                <p class="post-fallback-desc">${escapeHTML(message)}</p>
                <div class="post-fallback-actions">
                    <a href="notice.html" class="btn btn-primary">Back to News List</a>
                    <a href="../index.html" class="btn btn-secondary">Go to Home</a>
                </div>
            </div>
        `;
    }
}

window.addEventListener('dataLoaded', loadNoticeDetail);

if (typeof newsData !== 'undefined' && newsData.length > 0) {
    loadNoticeDetail();
}
