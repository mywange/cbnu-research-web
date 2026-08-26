// 갤러리 리스트 관리
let currentPage = 1;
const itemsPerPage = 5;

// 데이터 로드 완료 후 갤러리 불러오기
window.addEventListener('dataLoaded', function() {
    loadGallery();
});

// 갤러리 데이터 불러오기
function loadGallery() {
    if (!galleryData || galleryData.length === 0) {
        console.warn('갤러리 데이터를 불러올 수 없습니다.');
        const galleryListContainer = document.getElementById('gallery-list');
        if (galleryListContainer) {
            galleryListContainer.innerHTML = '<p style="text-align: center; padding: 40px 0;">등록된 갤러리가 없습니다.</p>';
        }
        return;
    }

    // 최신순으로 정렬 (id가 높을수록 최신)
    const sortedGallery = [...galleryData].sort((a, b) => b.id - a.id);

    displayGallery(currentPage, sortedGallery);
    displayPagination(sortedGallery);
}

// 갤러리 목록 표시
function displayGallery(page, sortedGallery) {
    const galleryListContainer = document.getElementById('gallery-list');
    if (!galleryListContainer) return;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageGallery = sortedGallery.slice(startIndex, endIndex);

    if (pageGallery.length === 0) {
        galleryListContainer.innerHTML = '<p style="text-align: center; padding: 40px 0;">등록된 갤러리가 없습니다.</p>';
        return;
    }

    galleryListContainer.innerHTML = pageGallery.map(gallery => `
        <article class="news-item-page">
            <div class="news-thumbnail">
                <a href="gallery-detail.html?id=${gallery.id}">
                    <img src="${gallery.thumbnail}" alt="${gallery.title}">
                </a>
            </div>
            <div class="news-info">
                <h3><a href="gallery-detail.html?id=${gallery.id}">${gallery.title}</a></h3>
                <p class="news-summary">${gallery.summary}</p>
                <div class="news-meta">
                    <span class="news-date">${gallery.date}</span>
                </div>
            </div>
        </article>
    `).join('');
}

// 페이지네이션 표시
function displayPagination(sortedGallery) {
    const paginationContainer = document.getElementById('gallery-pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(sortedGallery.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // 이전 버튼
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage - 1})">이전</button>`;
    }

    // 페이지 번호들
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="page-btn active">${i}</button>`;
        } else {
            paginationHTML += `<button class="page-btn" onclick="changePage(${i})">${i}</button>`;
        }
    }

    // 다음 버튼
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="changePage(${currentPage + 1})">다음</button>`;
    }

    paginationContainer.innerHTML = paginationHTML;
}

// 페이지 변경
function changePage(page) {
    currentPage = page;
    const sortedGallery = [...galleryData].sort((a, b) => b.id - a.id);
    displayGallery(currentPage, sortedGallery);
    displayPagination(sortedGallery);

    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
