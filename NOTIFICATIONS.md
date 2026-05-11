# 📩 문의 알림 설정 가이드

문의 폼에 누군가 문의를 남기면 두 가지 방식으로 알림 받을 수 있습니다.

---

## 옵션 A: 이메일 알림 (네이버 메일) ⭐ 추천

본인 네이버 이메일로 자동 알림 발송. **기록도 남아서 가장 안전**.

### 1단계: 네이버 SMTP 활성화
1. 네이버 메일 접속 → 우측 상단 **환경설정**
2. **POP3/IMAP 설정** 탭
3. **POP3/SMTP 사용** → "사용함" 체크
4. 저장

### 2단계: 2단계 인증 + 앱 비밀번호 (보안 강화 시)
- 일반 비밀번호로도 가능하지만, **2단계 인증 + 앱 비밀번호** 사용 권장
- 네이버 → 내정보 → 보안 설정 → 2단계 인증 ON
- → **애플리케이션 비밀번호** 생성 → 비밀번호 16자리 복사

### 3단계: Render 환경변수 추가
Render 대시보드 → `devvibe-api` → **Environment** 탭 → Add:

| Key | Value |
|-----|-------|
| `EMAIL_HOST` | `smtp.naver.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `roqkfwkwlgh@naver.com` |
| `EMAIL_PASS` | `네이버 앱 비밀번호` |
| `NOTIFY_EMAIL_TO` | `roqkfwkwlgh@naver.com` (받을 주소, 본인) |

→ Save Changes (자동 재배포)

---

## 옵션 B: Discord 푸시 알림 ⚡ (모바일 즉시 알림)

Discord 모바일 앱이 있으면 **새 문의 시 카톡처럼 푸시 알림** 옴.

### 1단계: Discord 가입 + 서버 만들기
1. https://discord.com/register 가입
2. 좌측 **"+"** → 서버 만들기 → "나만의 서버" 선택
3. 서버 이름: "Dev.Vibe 알림" 등

### 2단계: 웹훅 만들기
1. 만든 서버의 채널 (예: #일반) 우측 **⚙️**
2. **연동** → **웹후크 만들기**
3. 이름: "문의 알림", 채널 선택
4. **웹후크 URL 복사** 클릭

### 3단계: Render 환경변수 추가
| Key | Value |
|-----|-------|
| `NOTIFY_WEBHOOK_URL` | `https://discord.com/api/webhooks/xxxxx/yyyy` |

→ Save Changes

### 4단계: 모바일 푸시 받기
- Discord 모바일 앱 설치
- 같은 계정 로그인
- 해당 채널 알림 ON
- → 문의 들어오면 푸시 알림 즉시 옴

---

## 옵션 C: 둘 다 같이 쓰기

두 환경변수 모두 설정하면 **이메일 + 디스코드 동시 발송**됩니다.

---

## 테스트 방법

1. 사이트 → Contact 페이지
2. 폼 작성 후 "문의 보내기"
3. 1~2초 후:
   - 이메일 받은편지함에 알림 메일 도착
   - Discord 채널에 메시지 도착
4. Admin 페이지 (`/admin`)에도 문의 기록됨

---

## ⚠️ 문제 해결

**이메일 안 옴**
- 네이버 SMTP 설정 확인 (POP3/SMTP "사용함")
- 앱 비밀번호 / 일반 비밀번호 정확한지 확인
- Render 환경변수 다섯 개 다 입력했는지
- Render Logs에서 `[email]` 에러 확인

**Discord 알림 안 옴**
- 웹훅 URL 정확한지 (https://discord.com/api/webhooks/ 로 시작)
- Render Logs에서 `[webhook]` 에러 확인
- 모바일 앱 알림 권한 ON

**스팸함 가는 경우**
- 네이버는 본인 → 본인 메일이라 스팸 거의 없음
- 만약 가면 "스팸 아님" 표시
