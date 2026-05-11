# Portfolio Images (영구 보존용)

이 폴더에 포트폴리오 이미지를 넣으면 **git에 커밋되어 영구 보존**됩니다.

## 사용 방법

1. 이미지 파일을 이 폴더에 복사
   ```
   frontend/public/portfolio-images/
     ├── autowant-thumb.png
     ├── autowant-1.png
     ├── velcrocat-thumb.png
     └── velcrocat-1.png
   ```

2. `backend/data/seed-portfolios.json` 에서 thumbnail/images를 경로로 지정:
   ```json
   {
     "thumbnail": "/portfolio-images/autowant-thumb.png",
     "images": [
       "/portfolio-images/autowant-1.png",
       "/portfolio-images/autowant-2.png"
     ]
   }
   ```

3. git commit + push → Render 자동 재배포 → 이미지 영구 표시 ✅

## 권장 사이즈

- 썸네일: **800×600px 이상** (16:10 또는 4:3)
- 갤러리: **1200×800px 이상**
- 포맷: WebP > PNG > JPG (WebP가 가장 작음)
- 파일 크기: 각 1MB 이하 권장

## 파일명 규칙

- 영문 소문자 + 하이픈 (`autowant-thumb.png`)
- 한글/공백 X (URL 인코딩 문제)
