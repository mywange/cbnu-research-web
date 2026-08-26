// ==========================================================================
// CBNU Research Group - Data Loader
// ==========================================================================

// Helper function to fetch JSON with path fallbacks
async function fetchJsonWithFallback(filename) {
    const timestamp = new Date().getTime();
    const isSubdir = window.location.pathname.includes('/community/') || 
                     window.location.pathname.includes('/publications/') || 
                     window.location.pathname.includes('/people/') || 
                     window.location.pathname.includes('/about/') || 
                     window.location.pathname.includes('/research/');
    
    const candidatePaths = [
        isSubdir ? `../data/${filename}?t=${timestamp}` : `data/${filename}?t=${timestamp}`,
        `./data/${filename}?t=${timestamp}`,
        `../data/${filename}?t=${timestamp}`,
        `data/${filename}?t=${timestamp}`
    ];

    for (const path of candidatePaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            // continue to next candidate
        }
    }
    return [];
}

// News 데이터 로드
async function loadNewsData() {
    try {
        const data = await fetchJsonWithFallback('news-data.json');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('News 데이터 로드 오류:', error);
        return [];
    }
}

// Events 데이터 로드
async function loadEventsData() {
    try {
        const data = await fetchJsonWithFallback('events-data.json');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Events 데이터 로드 오류:', error);
        return [];
    }
}

// 갤러리 데이터 로드
async function loadGalleryData() {
    try {
        const data = await fetchJsonWithFallback('gallery-data.json');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('갤러리 데이터 로드 오류:', error);
        return [];
    }
}

// Publications 데이터 로드
async function loadPublicationsData() {
    try {
        const data = await fetchJsonWithFallback('publications-data.json');
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Publications 데이터 로드 오류:', error);
        return [];
    }
}

// 전역 변수
let newsData = [];
let eventsData = [];
let galleryData = [];
let publicationsData = [];

// 데이터 초기화
async function initializeData() {
    newsData = await loadNewsData();
    eventsData = await loadEventsData();
    galleryData = await loadGalleryData();
    publicationsData = await loadPublicationsData();

    window.dispatchEvent(new CustomEvent('dataLoaded', {
        detail: { newsData, eventsData, galleryData, publicationsData }
    }));
}

// 페이지 로드 시 데이터 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeData);
} else {
    initializeData();
}
