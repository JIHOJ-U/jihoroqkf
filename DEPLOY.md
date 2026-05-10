# 🚀 Render 배포 가이드

## 사전 준비
- [x] Render 계정 ([render.com](https://render.com) 가입, GitHub 연동)
- [x] 프로젝트가 GitHub에 푸시되어 있어야 함

---

## 방법 A: Blueprint 자동 배포 (가장 쉬움) ⭐

### 1. Render 대시보드 접속
- https://dashboard.render.com

### 2. New → Blueprint
- GitHub 저장소 선택: `JIHOJ-U/jihoroqkf`
- Render가 `render.yaml`을 자동으로 읽음
- "Apply" 클릭 → 두 서비스 자동 생성:
  - `devvibe-api` (Backend, Node)
  - `devvibe-web` (Frontend, Static Site)

### 3. 배포 완료 후 URL 확인
- Backend: `https://devvibe-api.onrender.com`
- Frontend: `https://devvibe-web.onrender.com`

### 4. 추가 설정 (Render 대시보드에서)
**devvibe-api** Environment 탭:
- `ALLOWED_ORIGINS` = `https://devvibe-web.onrender.com` (CORS 허용)
- `NOTIFY_WEBHOOK_URL` = (Discord/Slack webhook URL, 선택)

**devvibe-web** Environment 탭:
- `REACT_APP_API_URL` = `https://devvibe-api.onrender.com` (이미 yaml에 있지만 확인)

→ 환경변수 변경 후 "Manual Deploy" 클릭해서 재배포

---

## 방법 B: 수동 생성

### Backend 먼저
1. New → **Web Service** → 저장소 선택
2. 설정:
   - Name: `devvibe-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free
3. Environment 변수 추가:
   - `NODE_VERSION` = `18`
   - `GITHUB_USERNAME` = `JIHOJ-U`
   - `NAVER_BLOG_ID` = `longnight0719`
   - `ALLOWED_ORIGINS` = (Frontend URL, 나중에 추가)
4. Create → 배포 시작 → 완료 시 URL 복사

### Frontend
1. New → **Static Site** → 같은 저장소 선택
2. 설정:
   - Name: `devvibe-web`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
3. Environment 변수:
   - `REACT_APP_API_URL` = (위에서 복사한 backend URL)
4. Redirects/Rewrites 추가 (SPA용):
   - Source: `/*` → Destination: `/index.html` → Type: `Rewrite`
5. Create → 배포 → URL 확인

### 마지막: CORS 연결
- Backend의 `ALLOWED_ORIGINS`에 frontend URL 추가
- Backend 재배포

---

## ⚠️ 무료 플랜 제약

| 항목 | 내용 |
|------|------|
| **콜드 스타트** | 15분 무활동 시 sleep → 다음 요청 시 ~30초 wake up |
| **파일 시스템** | 휘발성. 백엔드 재배포 시 `uploads/`, `data/` 초기화 |
| **빌드 시간** | 월 500분 |
| **대역폭** | 월 100GB |

### 데이터 영속화 권장 (다음 단계)
- **MongoDB Atlas** (무료 512MB) → 포트폴리오/문의 데이터
- **Cloudinary** (무료 25GB) → 이미지 업로드
- 또는 **Render Disk** (유료, 월 $1~)

---

## ✅ 배포 후 체크리스트
- [ ] 메인 페이지 로드 확인
- [ ] About / Portfolio / Contact 모두 작동
- [ ] 포트폴리오 등록 (이미지 업로드 포함) 테스트
- [ ] 문의 폼 제출 → admin 페이지에서 확인
- [ ] GitHub 패널 데이터 로드
- [ ] 블로그 RSS 정상 표시
- [ ] 카카오톡에 URL 공유해서 OG 이미지 노출 확인

---

## 🔧 문제 해결

**"CORS error"**
→ Backend `ALLOWED_ORIGINS`에 정확한 frontend URL 추가했는지 확인 (https:// 포함, 끝 `/` 없이)

**Frontend가 API 호출 못 함**
→ `REACT_APP_API_URL` 환경변수 설정 후 **반드시 재빌드** (변수 변경 후 Manual Deploy)

**404 on refresh**
→ Static Site에 SPA rewrite 룰 추가 (`/*` → `/index.html`)

**사진/포트폴리오 사라짐**
→ 백엔드 재시작 시 정상. MongoDB 등으로 마이그레이션 필요
