# AI 홈페이지 시안 생성기 — 설계

- **날짜:** 2026-08-03
- **목적:** 리드 유입/영업 도구. 방문자가 업종·목표를 입력하면 AI가 홈페이지 시안(헤드라인·섹션 구성·톤 제안)을 만들어 보여주고, "실제 제작 상담" CTA로 Contact 문의를 유도한다.
- **비목적:** 실제로 편집 가능한 사이트를 생성·호스팅하는 빌더 제품이 아니다. AI는 초안만 만들고, 실제 결과물은 언제나 사람이 직접 코드로 완성한다는 포지셔닝을 유지한다 (홈 "Why Full-Stack" 섹션과 모순되지 않게).

## 사용자 흐름

1. 독립 페이지 `/ai-preview` 진입 (Home/Services 등에서 CTA로 유입)
2. 입력 폼 (Contact 폼과 비슷한 수준의 상세도):
   - 업종 (드롭다운)
   - 사이트 목표 (예: 예약, 판매, 문의 유입)
   - 원하는 분위기 (칩 선택, 단일 선택 — Contact 폼의 프로젝트 유형 라디오칩과 동일한 UI 패턴)
   - 필수 기능 (자유 텍스트)
   - 참고 사이트 (선택)
   - 이메일 (필수)
3. "AI 시안 받기" 클릭 → 이메일 포함 폼 전체가 즉시 백엔드에 저장됨 (리드 확보는 생성 성공 여부와 무관)
4. 백엔드가 LLM 호출 → 구조화된 JSON 결과를 받아 저장 후 프론트에 반환
5. 결과를 카드 UI로 표시: 헤드라인, 태그라인, 추천 섹션 목록(3~6개, 각 제목+한줄설명), 톤/분위기 제안, 추천 액센트 컬러 2~3개
6. 결과 하단 CTA "이 방향으로 실제 제작 상담받기" → `/contact`로 이동하며 입력했던 내용을 prefill (기존 QuoteCalculator / PortfolioDetail "비슷한 거 만들기"와 동일한 `location.state.prefill` 패턴 재사용)
7. AI 호출 실패/타임아웃 시: 친절한 에러 메시지 + "AI 없이 바로 상담 신청" 버튼으로 폴백 (사람에게 넘기는 것으로 항상 탈출구 제공)

## AI 출력 스키마

프리텍스트가 아니라 고정 JSON 스키마로 강제한다 (레이아웃 깨짐/일관성 문제 방지):

```json
{
  "headline": "string",
  "tagline": "string",
  "sections": [
    { "title": "string", "description": "string" }
  ],
  "toneSuggestion": "string",
  "suggestedColors": ["#hex", "#hex"]
}
```

- `sections`: 3~6개로 프롬프트에서 강제
- 모델에 system prompt로 스키마 + 규칙을 지시하고, 응답을 JSON.parse 후 스키마 검증 (필드 누락/타입 오류 시 에러 처리 → 위 4번의 실패 폴백으로 연결)

## 모델 & 비용 최적화

- **모델:** Claude Haiku 4.5 (짧은 구조화 카피 생성에 충분, 저비용, 한국어 품질 양호)
- **프롬프트 캐싱:** system prompt(스키마 정의, 생성 규칙, 예시 — 매 요청 거의 동일한 정적 블록)를 Anthropic 프롬프트 캐싱으로 캐시. 가변부(방문자 입력)만 비캐시. 정적 블록이 프롬프트의 70~80%를 차지하므로 캐시 적중 시 전체 API 비용이 캐싱 없을 때 대비 대략 70~80% 절감되는 효과
- **출력 토큰 상한:** `max_tokens`를 스키마 크기에 맞게 타이트하게 설정 (예: 500~600 토큰)

## 남용/비용 방지

- IP당 하루 생성 횟수 제한 (예: 3회) — 외부 의존성 추가 없이 서버 메모리 내 Map 기반 카운터로 구현 (백엔드에 이미 rate-limit 관련 패키지가 없고, 단일 프로세스라 충분)
- 이메일 필수 입력이 1차 스팸 방지 역할
- 서버 사이드에서 입력 필드 길이 제한 (프롬프트 인젝션/과도한 토큰 사용 방지)

## 백엔드

기존 `backend/server.js`의 인콰이어리 라우트 패턴을 그대로 따른다 (단일 파일, pg 우선·파일 폴백, `CREATE TABLE IF NOT EXISTS` 인라인 초기화).

- 새 테이블 `ai_previews`:
  ```sql
  CREATE TABLE IF NOT EXISTS ai_previews (
    id             UUID PRIMARY KEY,
    email          TEXT NOT NULL,
    business_type  TEXT DEFAULT '',
    site_goal      TEXT DEFAULT '',
    mood           TEXT DEFAULT '',
    must_have      TEXT DEFAULT '',
    reference_site TEXT DEFAULT '',
    result         JSONB,
    status         TEXT DEFAULT '생성됨',
    created_at     TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- `POST /api/ai-preview` — 입력 저장(즉시) → LLM 호출 → 결과 업데이트 후 반환. LLM 실패 시에도 입력은 이미 저장된 상태 유지
- `GET /api/ai-previews` — Admin 전용, 인콰이어리 관리 화면과 같은 패턴으로 리드 목록 조회 (이번 스펙 범위에는 백엔드 API까지만 포함, Admin 화면 UI 추가는 후속 작업으로 분리)
- 새 의존성: `@anthropic-ai/sdk`

## 프론트엔드

- 새 페이지 `frontend/src/pages/AiPreview.js` (+ css), 라우트 `/ai-preview` 추가, `App.js`의 lazy route 목록에 편입
- 다국어(ko/en) 지원 — 기존 `LanguageContext` 패턴 재사용
- 카드 UI는 사이트 기존 컴포넌트 스타일(모노스페이스 라벨, 인디고 액센트 등)을 따르되 새 컴포넌트로 구현 — AI 실시간 HTML은 렌더링하지 않음
- prefill 이동은 기존 `location.state.prefill` 패턴 재사용

## 카피/포지셔닝

페이지 상단에 명시적으로: "AI가 초안을 빠르게 잡아드려요. 실제 완성은 사람이 직접 코드로 만듭니다." 톤 — 빌더 서비스처럼 AI가 완제품을 만들어준다는 인상을 피하고, 홈페이지의 기존 "왜 풀스택인가" 메시지와 일관성을 유지한다.

## 범위 밖 (후속 작업)

- Admin에서 AI 프리뷰 리드 목록을 보는 UI (백엔드 API는 이번 스펙에 포함, 화면은 별도)
- 실제 라이브 렌더링 미리보기 (이번엔 텍스트/카드 시안까지만)
- 다국어 프롬프트 품질 튜닝은 1차 구현 후 실사용 데이터 보고 조정
