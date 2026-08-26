// ==========================================================================
// CBNU Research Group - Events Detail Controller
// ==========================================================================

function getEventIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function loadNewsDetail() {
    const eventId = getEventIdFromURL();

    if (!eventId) {
        showError('Invalid event ID or missing parameter.');
        return;
    }

    if (!eventsData || eventsData.length === 0) {
        showError('Could not load events data. Please try again later.');
        return;
    }

    const item = eventsData.find(n => String(n.id) === String(eventId));
    if (!item) {
        showError(`Event #${eventId} could not be found or has been removed.`);
        return;
    }

    displayEventDetail(item);
}

function displayEventDetail(item) {
    // Set Header Metadata
    const titleEl = document.getElementById('notice-title');
    const categoryEl = document.getElementById('notice-category');
    const newBadgeEl = document.getElementById('notice-new-badge');
    const authorEl = document.getElementById('notice-author');
    const dateEl = document.getElementById('notice-date');
    const contentEl = document.getElementById('notice-content');

    if (titleEl) titleEl.textContent = item.title;
    if (categoryEl) categoryEl.textContent = item.category || 'Event';
    if (authorEl) authorEl.textContent = item.author || 'Organizer';
    if (dateEl) dateEl.textContent = item.date || '-';

    if (newBadgeEl) {
        newBadgeEl.style.display = item.isNew ? 'inline-block' : 'none';
    }

    // Markdown Content Parsing
    const raw = item.content || item.summary || '';
    let contentHtml = typeof marked !== 'undefined'
        ? marked.parse(raw)
        : raw.replace(/\n/g, '<br>');

    // Optional: If there is a thumbnail image specified in frontmatter
    if (item.thumbnail) {
        contentHtml = `
            <div class="post-featured-thumbnail" style="margin-bottom: 24px; text-align: center;">
                <img src="${item.thumbnail}" alt="${item.title}" style="max-width: 100%; border-radius: 10px; box-shadow: 0 4px 18px rgba(0,0,0,0.06);">
            </div>
            ${contentHtml}
        `;
    }

    if (contentEl) {
        contentEl.innerHTML = contentHtml || '<p style="color: #64748B;">No additional description provided.</p>';
    }

    // Attachments Handling
    const existingAttachments = document.querySelector('.notice-attachments');
    if (existingAttachments) existingAttachments.remove();

    if (item.attachments && Array.isArray(item.attachments) && item.attachments.length > 0) {
        const attachmentsHtml = `
            <div class="notice-attachments">
                <h3><span class="material-symbols-outlined" style="font-size: 19px; color: var(--primary-color);">attach_file</span> Attachments</h3>
                <ul class="attachment-list">
                    ${item.attachments.map(file => `
                        <li class="attachment-item">
                            <a href="${file.url}" target="_blank" rel="noopener noreferrer" download>
                                <span class="material-symbols-outlined" style="font-size: 17px;">description</span>
                                <span class="file-name">${file.name || 'Download File'}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        const footerEl = document.querySelector('.post-detail-footer');
        if (footerEl) {
            footerEl.insertAdjacentHTML('beforebegin', attachmentsHtml);
        }
    }

    document.title = `${item.title} - CBNU Research Group`;
}

function showError(msg) {
    const titleEl = document.getElementById('notice-title');
    const authorEl = document.getElementById('notice-author');
    const dateEl = document.getElementById('notice-date');
    const contentEl = document.getElementById('notice-content');

    if (titleEl) titleEl.textContent = 'Event Not Found';
    if (authorEl) authorEl.textContent = '-';
    if (dateEl) dateEl.textContent = '-';
    if (contentEl) {
        contentEl.innerHTML = `
            <div class="post-fallback-box">
                <span class="material-symbols-outlined post-fallback-icon">event_busy</span>
                <h3 class="post-fallback-title">404 - Event Unavailable</h3>
                <p class="post-fallback-desc">${msg}</p>
                <div class="post-fallback-actions">
                    <a href="news.html" class="btn btn-primary">Back to Events List</a>
                    <a href="../index.html" class="btn btn-secondary">Go to Home</a>
                </div>
            </div>
        `;
    }
}

window.addEventListener('dataLoaded', loadNewsDetail);

if (typeof eventsData !== 'undefined' && eventsData.length > 0) {
    loadNewsDetail();
}
