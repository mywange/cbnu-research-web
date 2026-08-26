// 갤러리 상세 페이지 스크립트

// URL에서 갤러리 ID 추출
function getGalleryIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// 갤러리 상세 정보 표시
function displayGalleryDetail(gallery) {
    if (!gallery) {
        document.getElementById('gallery-title').textContent = '갤러리를 찾을 수 없습니다.';
        document.getElementById('gallery-date').textContent = '-';
        document.getElementById('gallery-content').innerHTML = '<p>요청하신 갤러리를 찾을 수 없습니다.</p>';
        return;
    }

    // 제목 설정
    document.getElementById('gallery-title').textContent = gallery.title;
    document.title = `${gallery.title} - HY HCI Group`;

    // 메타 정보 설정
    document.getElementById('gallery-date').textContent = gallery.date;

    // 내용 설정 (Markdown 렌더링)
    const contentElement = document.getElementById('gallery-content');
    if (gallery.content) {
        // Marked.js를 사용하여 Markdown을 HTML로 변환
        contentElement.innerHTML = marked.parse(gallery.content);
    } else {
        contentElement.innerHTML = '<p>내용이 없습니다.</p>';
    }
}

// 갤러리 데이터 로드 및 표시
function loadGalleryDetail() {
    const galleryId = getGalleryIdFromURL();

    if (!galleryId || isNaN(galleryId)) {
        document.getElementById('gallery-title').textContent = '잘못된 접근입니다.';
        document.getElementById('gallery-date').textContent = '-';
        document.getElementById('gallery-content').innerHTML = '<p>갤러리 ID가 유효하지 않습니다.</p>';
        return;
    }

    // galleryData는 data-loader.js에서 로드됨
    if (!galleryData || galleryData.length === 0) {
        console.error('갤러리 데이터를 불러올 수 없습니다.');
        document.getElementById('gallery-title').textContent = '오류';
        document.getElementById('gallery-date').textContent = '-';
        document.getElementById('gallery-content').innerHTML = '<p>갤러리 데이터를 불러오는데 실패했습니다.</p>';
        return;
    }

    // 해당 ID의 갤러리 찾기
    const gallery = galleryData.find(g => g.id === galleryId);
    displayGalleryDetail(gallery);
}

// 데이터 로드 완료 후 실행
window.addEventListener('dataLoaded', loadGalleryDetail);
