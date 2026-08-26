# CBNU Research Group Website (HCI & Data Mining)

충북대학교 정보통신공학부 및 소프트웨어학부 **HCI(인간-컴퓨터 상호작용) & DM(데이터 마이닝) 공동 연구 그룹**의 공식 웹사이트입니다.

관리자가 별도의 복잡한 환경 설정 없이도, **마크다운(`.md`) 파일이나 JSON 파일, 이미지를 폴더에 추가하는 것만으로 손쉽게 웹사이트 콘텐츠를 등록 및 업데이트**할 수 있도록 설계된 파일 기반 경량 CMS 아키텍처를 제공합니다.

---

## 📂 디렉토리 구조 (Directory Map)

```text
cbnu-research-web/
├── index.html                   # 메인 랜딩 페이지 (연구실 소개, 최신 논문/소식/행사/갤러리 쇼케이스)
├── styles.css                   # 공통 반응형 CSS 디자인 시스템
├── script.js                    # 메인 UI 인터랙션 (모바일 메뉴, 스크롤 인터랙션 등)
├── components.js                # 서브페이지 공통 Header/Footer 컴포넌트 렌더러
├── components-index.js          # 루트 메인페이지 공통 Header/Footer 컴포넌트 렌더러
├── .gitignore                   # Git 배포 제외 설정 (OS, IDE, Logs 등)
│
├── start-server.bat             # [1클릭] 무설치 로컬 테스트 웹 서버 실행기
├── sync-data.bat                # [1클릭] 무설치 마크다운 데이터 파싱 및 통합 동기화기
│
├── about/                       # About 페이지
│   └── about.html               # 연구 그룹 비전, 미션, 연구실 정보
├── publications/                # Publications 페이지
│   └── publications.html        # 논문 83편 검색, 카테고리/연구실 필터링, 저자 하이라이트
├── people/                      # People 페이지
│   └── people.html              # 교수진(Faculty), 석사(M.S.), 학부연구생(Undergrad) 프로필
├── community/                   # 소통 및 게시판 페이지
│   ├── notice.html              # News 목록 (공지/소식)
│   ├── notice-detail.html       # News 상세 페이지 (마크다운 렌더링)
│   ├── news.html                # Events 목록 (학술행사/세미나)
│   ├── news-detail.html         # Events 상세 페이지 (마크다운 렌더링)
│   └── gallery.html             # Gallery 목록 (활동 사진)
│
├── images/                      # 📷 정적 이미지 에셋
│   ├── people/                  # 👤 구성원 프로필 사진 (david-kang.jpg, bogoan-kim.JPG 등)
│   ├── news/                    # 📰 뉴스 및 공지 본문 첨부 이미지
│   └── gallery/                 # 🖼️ 갤러리 및 행사 사진
│
├── data/                        # 🗄️ 웹사이트 콘텐츠 데이터베이스 (CMS)
│   ├── news/                    # 📰 개별 News 마크다운 (.md) 저장 폴더
│   ├── events/                  # 📅 개별 Events 마크다운 (.md) 저장 폴더
│   ├── gallery/                 # 🖼️ 개별 Gallery 마크다운 (.md) 저장 폴더
│   ├── publications-data.json   # 📚 전체 논문 데이터 (83편 정식 원본)
│   ├── publications.json        # 📚 publications-data.json 동기화 복사본
│   ├── news-data.json           # 🔄 data/news/ 에서 자동 빌드된 News 통합 JSON
│   ├── events-data.json         # 🔄 data/events/ 에서 자동 빌드된 Events 통합 JSON
│   └── gallery-data.json        # 🔄 data/gallery/ 에서 자동 빌드된 Gallery 통합 JSON
│
├── scripts/                     # 빌드 및 유틸리티 스크립트
│   ├── build-data.js            # Node.js 기반 데이터 빌더
│   ├── start-server.ps1         # PowerShell 기반 로컬 HTTP 서버 (CORS 지원)
│   └── sync-data.ps1            # PowerShell 기반 마크다운 파서 및 데이터 동기화기
│
├── js/                          # 프론트엔드 동적 렌더링 스크립트
│   ├── data-loader.js           # 통합 JSON 데이터 비동기 로더 (캐시 방지 및 상대경로 지원)
│   ├── index-notices.js         # 메인 페이지 최신 논문/소식/행사 동적 렌더러
│   ├── notice-list.js           # News 목록 및 페이지네이션
│   ├── notice-detail.js         # News 마크다운 상세 뷰어 (marked.js 연동)
│   ├── news-list.js             # Events 목록 및 페이지네이션
│   ├── news-detail.js           # Events 마크다운 상세 뷰어
│   └── publications-list.js     # 논문 검색, 카테고리 필터링 및 저자 볼드 하이라이팅
│
└── assets/                      # 사이트 공통 정적 에셋
    └── CBNU_logo.png            # 충북대학교 로고
```

---

## 🚀 빠른 시작 (Quick Start)

### 1. 로컬 웹 서버 실행 (웹사이트 확인)
- 루트 폴더의 **`start-server.bat`** 파일을 더블 클릭합니다.
- 콘솔 창이 열리며 기본 웹 브라우저에서 `http://localhost:8080/`이 자동으로 열립니다.

### 2. 데이터 동기화 (콘텐츠 변경 사항 반영)
- `data/` 하위 폴더에 새 글(`.md`)이나 논문을 추가한 후, **`sync-data.bat`** 파일을 더블 클릭합니다.
- 마크다운 파일들이 자동으로 파싱되어 `news-data.json`, `events-data.json`, `gallery-data.json`으로 업데이트됩니다.

> **💡 개발자 환경 (Node.js/npm) 명령어**:
> - `npm start` : 로컬 서버 시작
> - `npm run sync` : PowerShell 기반 데이터 동기화
> - `npm run build:data` : Node.js로 마크다운 데이터 파싱 및 동기화

---

## 📝 콘텐츠 업로드 및 유지보수 가이드

### 1. People (연구실 구성원) 관리
* **프로필 사진 저장 위치**: `images/people/` (예: `david-kang.jpg`, `bogoan-kim.JPG` 등)
* **파일 위치**: `people/people.html`
* **사진 위치/초점 미세 조정**: [styles.css](styles.css)의 `.person-photo` 클래스에서 `object-position: center 20%;` 속성으로 얼굴 중심 높낮이를 조절할 수 있습니다.

### 2. Publications (논문) 추가 및 관리
* **파일 위치**: `data/publications-data.json`
* **순서 규칙**: 최신 연도부터 과거 연도까지 순차적으로 `[83]`번부터 `[1]`번까지 단일 시퀀스로 넘버링되어 있습니다.
* **저자 Bold 하이라이트**: `js/publications-list.js` 및 `js/index-notices.js`에 등록된 공식 연구실 구성원(11인)의 이름이 자동으로 볼드 처리됩니다.
* 수정 후 `sync-data.bat`을 실행하면 `data/publications.json`에 동기화되고 메인 페이지와 Publications 페이지에 즉시 반영됩니다.

### 3. News (공지/소식) 및 Events (학술행사) 등록
1. `data/news/` 또는 `data/events/` 폴더에 `YYYY-MM-DD-제목.md` 파일 생성
2. 상단에 Frontmatter 작성 후 마크다운 본문 입력:
   ```markdown
   ---
   title: "게시글 제목"
   date: "2026.09.01"
   author: "Admin"
   category: "Notice"
   isNew: true
   ---
   
   ## 마크다운 본문 작성
   ```
3. `sync-data.bat` 더블 클릭 실행

### 4. Gallery (사진 갤러리) 등록
1. 사진 파일을 `images/gallery/`에 복사합니다.
2. `data/gallery/` 폴더에 마크다운 파일을 생성하고 `image`, `thumbnail` 경로를 지정합니다:
   ```markdown
   ---
   title: "2026 하계 워크숍"
   date: "2026.08.20"
   image: "../images/gallery/2026-workshop.jpg"
   thumbnail: "../images/gallery/2026-workshop.jpg"
   category: "Workshop"
   description: "워크숍 현장 사진입니다."
   ---
   ```
3. `sync-data.bat` 더블 클릭 실행

---

## 🌐 GitHub Pages 배포 안내 (무료 호스팅)

본 프로젝트는 순수 정적 웹 기술(Static Web)로 설계되어 **GitHub Pages를 통해 100% 무료로 배포**할 수 있습니다.

1. **저장소 푸시**: 프로젝트 코드를 GitHub 리포지토리에 푸시합니다.
2. **GitHub Pages 활성화**:
   - 저장소 `Settings` > `Pages` 메뉴로 이동합니다.
   - **Source**: `Deploy from a branch` 선택
   - **Branch**: `main` (또는 `master`) / `/ (root)` 선택 후 **Save** 클릭
3. **배포 확인**: 약 1~2분 후 생성되는 `https://<username>.github.io/<repository-name>/` 주소로 접속하시면 모든 페이지와 데이터가 완벽하게 구동됩니다.

---

## 📧 문의 및 관리

- **연구실**: 충북대학교 정보통신공학부 (HCI Lab) & 소프트웨어학부 (DM Lab)
- **저작권**: © 2026 CBNU Research Group. All rights reserved.