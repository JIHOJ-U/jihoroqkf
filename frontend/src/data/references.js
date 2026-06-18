/* Industry reference data — fake titles + Unsplash imagery.
   Each entry includes:
     - basic display (cat / title / desc / image)
     - slug for /references/:slug route
     - mockup data used by the detail page to render an admin-style preview UI */

export const CATEGORIES = [
  { key: 'all',           ko: '전체보기',      en: 'All' },
  { key: 'manufacturing', ko: '제조/산업',     en: 'Manufacturing' },
  { key: 'healthcare',    ko: '의료/병원',     en: 'Healthcare' },
  { key: 'public',        ko: '공공/행정',     en: 'Government' },
  { key: 'education',     ko: '교육/학원',     en: 'Education' },
  { key: 'fnb',           ko: 'F&B/매장',      en: 'F&B / Retail' },
  { key: 'realestate',    ko: '부동산/건축',   en: 'Real Estate' },
  { key: 'beauty',        ko: '뷰티/패션',     en: 'Beauty / Fashion' },
  { key: 'saas',          ko: '스타트업/SaaS', en: 'Startup / SaaS' },
  { key: 'tools',         ko: '운영/도구',     en: 'Ops & Tools' },
  { key: 'nonprofit',     ko: '비영리/단체',   en: 'Nonprofit' },
];

const r = (entry) => entry; // identity helper for IDE folding

/* Template choices:
   - 'brand'     → lifestyle / service / hospitality (big hero photo, editorial)
   - 'dashboard' → operations / SaaS / IoT / admin (data-dense)  [fallback]
*/

export const REFERENCES = [
  // ============ 제조/산업 ============
  r({
    slug: 'motor-core-factory', cat: 'manufacturing',
    titleKo: '모터코어 파츠팩토리', titleEn: 'Motor Core Parts Factory',
    subKo: '자동차 부품 생산공장 ERP',
    descKo: '생산라인 실시간 현황 + 재고·발주·납기 통합 관리 대시보드',
    descEn: 'Real-time production line dashboard with inventory, ordering, and delivery management',
    img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    mockup: {
      brand: 'MotorCore', logoIcon: '⚙', domain: 'erp.motorcore.co.kr', accent: '#6366f1',
      ticker: [
        { tone: 'live',  label: '실시간', text: '라인A 가동중 · 진동 정상' },
        { tone: 'warn',  label: '주의',  text: 'B-21 재고 임계치 도달 — 발주 필요' },
        { tone: 'info',  label: '안내',  text: '주간 생산 목표 87% 달성' },
      ],
      menu: [
        { name: '대시보드',  tag: '실시간', active: true },
        { name: '생산현황',   tag: '8라인' },
        { name: '재고관리',   tag: '재고' },
        { name: '주문·발주', tag: '128건' },
        { name: '품질관리',   tag: 'QA' },
        { name: '직원관리',   tag: '24명' },
      ],
      stats: [
        { label: '오늘 생산량', value: '12,847', unit: 'pcs' },
        { label: '가동 라인',   value: '6 / 8',  unit: '' },
        { label: '대기 주문',   value: '128',    unit: '건' },
        { label: '품질 합격률', value: '98.4%',  unit: '' },
      ],
      actions: ['생산 시작', '재고 확인', '발주서 보기'],
      notices: [
        { type: '공지', title: '5월 생산 목표 달성률 87% — 라인별 상세' },
        { type: '안전', title: '예방 정비 일정 안내 (라인 C, 5/22)' },
        { type: '인증', title: 'ISO 9001 갱신 심사 결과' },
      ],
      hint: '생산·재고·품질 데이터가 모든 라인에서 실시간 동기화됩니다.',
    },
  }),
  r({
    slug: 'precision-chem-lab', cat: 'manufacturing',
    titleKo: '정밀화학 R&D 포털', titleEn: 'Precision Chemistry R&D Portal',
    subKo: '시약 재고 · 실험 일정 · 논문 라이브러리',
    descKo: '연구실 운영 + 실험 노트북 + 논문 아카이브를 한 곳에서 관리',
    descEn: 'Lab operations, experiment scheduling, and paper archives in one place',
    img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    mockup: {
      brand: 'PrecisionLab', logoIcon: '⚗', domain: 'lab.precisionchem.io', accent: '#10b981',
      ticker: [
        { tone: 'live', label: '진행중', text: '실험 #R-2847 · 4시간 12분 경과' },
        { tone: 'warn', label: '주의',  text: '벤젠 재고 3L 미만 — 발주 필요' },
      ],
      menu: [
        { name: '대시보드', tag: '오늘', active: true },
        { name: '실험 일정', tag: '12건' },
        { name: '시약 재고', tag: '재고' },
        { name: '실험 노트', tag: '노트' },
        { name: '논문 라이브러리', tag: '4,212' },
        { name: '연구원 관리', tag: '18명' },
      ],
      stats: [
        { label: '진행 실험',   value: '12', unit: '건' },
        { label: '이번 주 완료', value: '38', unit: '건' },
        { label: '시약 재고',   value: '842', unit: '종' },
        { label: '논문 인용',   value: '+24', unit: '회' },
      ],
      actions: ['실험 등록', '시약 발주', '논문 검색'],
      notices: [
        { type: '논문', title: 'Nature Chemistry 게재 결정 — Park et al.' },
        { type: '컨퍼런스', title: 'KCS 추계 학술대회 발표 일정' },
        { type: '안전', title: '실험실 안전 교육 의무 이수 안내' },
      ],
      hint: '모든 실험 데이터와 노트는 자동 백업되며 검색 가능합니다.',
    },
  }),
  r({
    slug: 'smart-factory-iot', cat: 'manufacturing',
    titleKo: '스마트팩토리 IoT 모니터링', titleEn: 'Smart Factory IoT Monitoring',
    subKo: '설비 가동률 · 온도 · 진동 실시간 추적',
    descKo: '생산 설비 센서 데이터를 시각화하고 이상 감지 시 자동 알림',
    descEn: 'Visualize sensor data and trigger automatic alerts on anomalies',
    img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80',
    mockup: {
      brand: 'SmartOps', logoIcon: '◐', domain: 'iot.smartfactory.kr', accent: '#0ea5e9',
      ticker: [
        { tone: 'live', label: 'LIVE', text: '센서 142개 정상 작동' },
        { tone: 'warn', label: '경고',  text: 'Line-B 온도 72°C 임계 근접' },
      ],
      menu: [
        { name: '실시간 모니터', tag: 'LIVE', active: true },
        { name: '설비 관리', tag: '12대' },
        { name: '이상 감지', tag: '경고 2' },
        { name: '예측 분석', tag: 'AI' },
        { name: '리포트', tag: '월간' },
        { name: '알림 설정', tag: '' },
      ],
      stats: [
        { label: '평균 가동률', value: '94.2%', unit: '' },
        { label: '활성 센서',   value: '142',   unit: '/ 144' },
        { label: '오늘 알림',   value: '3',     unit: '건' },
        { label: 'MTBF',        value: '2,840', unit: '시간' },
      ],
      actions: ['실시간 차트', '센서 추가', '알림 설정'],
      notices: [
        { type: '경고', title: 'Line-B 온도 임계 — 자동 감속 시작 (14:23)' },
        { type: '예측', title: '베어링 #7 교체 권장 — 7일 내' },
        { type: '리포트', title: '주간 가동률 리포트 발행 완료' },
      ],
      hint: '센서 이상치는 1초 내 감지되어 담당자에게 SMS·슬랙 알림.',
    },
  }),

  // ============ 의료/병원 ============
  r({
    slug: 'aesthetic-clinic-portal', cat: 'healthcare',
    titleKo: '성형외과 운영 포털', titleEn: 'Plastic Surgery Operations Portal',
    subKo: '예약 캘린더 · 수술실 배정 · CRM · 대기 알림',
    descKo: '주간 예약 캘린더(그리드 클릭→예약 추가) + 환자 CRM + 자동 알림',
    descEn: 'Weekly calendar, OR scheduling, patient CRM, and automated notifications',
    img: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80',
    mockup: {
      brand: 'AestheClinic', logoIcon: '✚', domain: 'staff.aestheclinic.kr', accent: '#ec4899',
      ticker: [
        { tone: 'live', label: '오늘', text: '예약 28건 · 수술실 가동 4/5' },
        { tone: 'info', label: '대기', text: '상담 대기 3명' },
      ],
      menu: [
        { name: '오늘 일정',   tag: '28건', active: true },
        { name: '예약 캘린더', tag: '주간' },
        { name: '수술실 배정', tag: '5실' },
        { name: '환자 CRM',    tag: '4,210' },
        { name: '시술 안내',   tag: '메뉴' },
        { name: '리뷰 관리',   tag: '★4.9' },
      ],
      stats: [
        { label: '오늘 예약',     value: '28', unit: '건' },
        { label: '대기 상담',     value: '3',  unit: '명' },
        { label: '이번 달 시술',  value: '142', unit: '건' },
        { label: '재방문율',      value: '67%', unit: '' },
      ],
      actions: ['예약 추가', '수술실 보기', '환자 검색'],
      notices: [
        { type: '예약', title: '내일 09:00 — VIP 상담 (김OO 고객)' },
        { type: '재고', title: '필러 재고 3박스 — 발주 검토' },
        { type: '교육', title: '신규 간호사 OT 일정 안내' },
      ],
      hint: '환자에게는 카카오 알림톡, 의료진에겐 슬랙으로 동시 안내.',
    },
  }),
  r({
    slug: 'leanview-dental', cat: 'healthcare',
    titleKo: '리앤뷰 치과', titleEn: 'Lean View Dental',
    subKo: '상담 예약 · 시술 안내 · 전후사례 · 사후관리',
    descKo: '시술 탐색(카테고리·정렬·검색) + 시술 상세 + 환자 케어 시스템',
    descEn: 'Consultation booking, treatment guide, before/after gallery, and follow-up care',
    img: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
    mockup: {
      brand: 'LeanView', logoIcon: '◈', domain: 'app.leanview.dental', accent: '#ec4899',
      ticker: [
        { tone: 'live', label: '진료중', text: '3진료실 · 4번 체어 가용' },
        { tone: 'info', label: '안내',   text: '치주 정기 검진 알림 발송 완료 (32명)' },
      ],
      menu: [
        { name: '진료 현황', tag: 'LIVE', active: true },
        { name: '예약 관리', tag: '주간' },
        { name: '환자 차트', tag: '2,840' },
        { name: '시술 사례', tag: '갤러리' },
        { name: '사후 관리', tag: '리마인더' },
        { name: '청구·결제', tag: '' },
      ],
      stats: [
        { label: '오늘 진료', value: '18', unit: '건' },
        { label: '체어 가동', value: '5/6', unit: '' },
        { label: '신환',     value: '4',  unit: '명' },
        { label: '월 매출',  value: '₩48M', unit: '' },
      ],
      actions: ['신환 등록', '예약 캘린더', '청구서 발행'],
      notices: [
        { type: '안내', title: '정기 검진 리마인더 자동 발송 완료' },
        { type: '교육', title: '구강 위생 콘텐츠 신규 업로드' },
        { type: '재고', title: '임플란트 픽스쳐 발주 — 다음주 도착' },
      ],
      hint: '환자별 진료 이력과 사진이 자동으로 카드로 정리됩니다.',
    },
  }),
  r({
    slug: 'oriental-medicine', cat: 'healthcare',
    titleKo: '한방병원 진료 시스템', titleEn: 'Korean Medicine Clinic',
    subKo: '진료 차트 · 처방 · 한약 조제 · 고객 이력',
    descKo: '한의사 차팅 + 처방전 + 한약 조제실 워크플로우 + 환자 카드',
    descEn: 'Charting, prescriptions, herb preparation workflow, and patient records',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    mockup: {
      brand: '한방원', logoIcon: '☯', domain: 'chart.hanbang.kr', accent: '#a16207',
      ticker: [
        { tone: 'live', label: '진료중', text: '제2진료실 · 김OO 환자' },
        { tone: 'info', label: '조제',   text: '한약 조제 대기 7건' },
      ],
      menu: [
        { name: '진료 차트', tag: '오늘', active: true },
        { name: '예약 관리', tag: '주간' },
        { name: '한약 조제', tag: '대기 7' },
        { name: '환자 이력', tag: '3,210' },
        { name: '처방 관리', tag: '템플릿' },
        { name: '재고·약재', tag: '재고' },
      ],
      stats: [
        { label: '오늘 진료', value: '24', unit: '건' },
        { label: '처방',     value: '18', unit: '건' },
        { label: '조제 대기', value: '7', unit: '건' },
        { label: '재진율',   value: '72%', unit: '' },
      ],
      actions: ['차트 작성', '처방전 발행', '약재 검색'],
      notices: [
        { type: '약재', title: '당귀·황기 재고 부족 — 발주 필요' },
        { type: '학회', title: '대한한의학회 추계 학술대회' },
        { type: '교육', title: '신규 한의사 차팅 시스템 OT' },
      ],
      hint: '한약 조제실 워크플로우와 환자 차트가 자동 연동됩니다.',
    },
  }),

  // ============ 공공/행정 ============
  r({
    slug: 'fire-station-portal', cat: 'public',
    titleKo: '○○소방서 안전 포털', titleEn: 'Fire Station Safety Portal',
    subKo: '출동 현황 · 안전교육 예약 · 화재예방 · 민원 신고',
    descKo: '실시간 출동 현황 지도 + 시민 교육 신청 + 민원 트래킹',
    descEn: 'Live dispatch map, safety training booking, and citizen complaint tracking',
    img: 'https://images.unsplash.com/photo-1599577180589-0a5d7ad11ad1?w=800&q=80',
    mockup: {
      brand: '119 소방서', logoIcon: '119', domain: 'safety.station.go.kr', accent: '#ef4444',
      ticker: [
        { tone: 'live', label: '현장', text: '화재 — 공장 내 연기 발생 (서부권 · 13:08)' },
        { tone: 'warn', label: '주의', text: '구급 — 호흡곤란 환자 이송 (도심권 · 12:55)' },
        { tone: 'info', label: '종료', text: '구조 — 승강기 갇힘 구조 완료 (북부권)' },
      ],
      menu: [
        { name: '상황판',    tag: '대시보드', active: true },
        { name: '안전교육',  tag: '예약' },
        { name: '화재예방',  tag: '체크' },
        { name: '민원·신고', tag: '접수' },
        { name: '자료실',    tag: '다운로드' },
        { name: '서소개',    tag: '' },
      ],
      stats: [
        { label: '금일 출동', value: '5', unit: '건' },
        { label: '진행중',   value: '3', unit: '건' },
        { label: '화재',     value: '2', unit: '건' },
        { label: '구급',     value: '1', unit: '건' },
      ],
      actions: ['출동 상황 보기', '교육 예약하기', '민원 접수/조회'],
      notices: [
        { type: '공지', title: '겨울철 화재예방 행동요령 안내 (난방기기 안전)' },
        { type: '보도', title: '○○소방서, 합동 소방훈련 실시 (유관기관 협업)' },
        { type: '채용', title: '의용소방대원 모집 공고' },
      ],
      hint: '긴급 신고는 119 전화가 최우선입니다. 교육·민원은 해당 메뉴 이용.',
    },
  }),
  r({
    slug: 'smart-city', cat: 'public',
    titleKo: '스마트시티 통합 서비스', titleEn: 'Smart City Integrated Service',
    subKo: '생활정보 · 민원 · 시설 안내 · 교통 안내',
    descKo: '시민이 매일 쓰는 시청 + 교통 + 공공시설을 하나의 앱으로',
    descEn: 'Daily-use city services — civic info, complaints, facilities, transit',
    img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
    mockup: {
      brand: 'SmartCity', logoIcon: '◉', domain: 'citizen.smartcity.go.kr', accent: '#3b82f6',
      ticker: [
        { tone: 'live', label: '교통', text: '강남대로 사고 — 우회 권장' },
        { tone: 'info', label: '날씨', text: '미세먼지 보통 · 강수확률 20%' },
      ],
      menu: [
        { name: '시민 대시보드', tag: '메인', active: true },
        { name: '민원 신청',     tag: '120' },
        { name: '시설 예약',     tag: '체육·문화' },
        { name: '교통·버스',     tag: '실시간' },
        { name: '생활 정보',     tag: '뉴스' },
        { name: '시정 소식',     tag: '' },
      ],
      stats: [
        { label: '오늘 민원',     value: '142', unit: '건' },
        { label: '예약 가능 시설', value: '24',  unit: '곳' },
        { label: '버스 운행',     value: '정상', unit: '' },
        { label: '미세먼지',      value: '보통', unit: '' },
      ],
      actions: ['민원 신청', '시설 예약', '버스 도착 보기'],
      notices: [
        { type: '시정', title: '○○시 종합계획안 시민 의견 수렴' },
        { type: '행사', title: '봄꽃 축제 5/24~5/30 — 셔틀 안내' },
        { type: '안전', title: '도로 공사 안내 (강남대로 야간)' },
      ],
      hint: '회원가입 없이 카카오/네이버 간편 로그인으로 바로 이용.',
    },
  }),
  r({
    slug: 'youth-policy', cat: 'public',
    titleKo: '청년정책 통합 포털', titleEn: 'Youth Policy Portal',
    subKo: '사업 안내 · 신청 · 지원금 매칭',
    descKo: '나에게 맞는 정책을 자동 추천하고 한 번에 신청 가능',
    descEn: 'Auto-recommend policies for your profile and apply with one click',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    mockup: {
      brand: 'YouthGov', logoIcon: '◇', domain: 'youth.gov.kr', accent: '#3b82f6',
      ticker: [
        { tone: 'live', label: '마감임박', text: '청년월세지원 — D-3' },
        { tone: 'info', label: '신규',    text: '청년창업 사관학교 모집 시작' },
      ],
      menu: [
        { name: '나에게 맞는 정책', tag: 'AI', active: true },
        { name: '주거 지원',         tag: '8건' },
        { name: '취업·창업',         tag: '24건' },
        { name: '교육·역량',         tag: '12건' },
        { name: '신청 내역',         tag: '내정보' },
        { name: '문의·상담',         tag: '챗봇' },
      ],
      stats: [
        { label: '전체 사업', value: '142', unit: '개' },
        { label: '내 자격',   value: '24',  unit: '개' },
        { label: '신청 가능', value: '12',  unit: '개' },
        { label: '평균 지원금', value: '180', unit: '만원' },
      ],
      actions: ['맞춤 정책 보기', '신청하기', '상담 예약'],
      notices: [
        { type: '마감', title: '청년월세지원 — D-3 마감 임박' },
        { type: '신규', title: '청년창업 사관학교 23기 모집' },
        { type: '안내', title: '신청서류 간소화 — 1분 신청 가능' },
      ],
      hint: '자격 자동 판별 + 신청서 자동 작성으로 1분 안에 완료.',
    },
  }),

  // ============ 교육 ============
  r({
    slug: 'english-academy', cat: 'education',
    titleKo: '영어학원 통합 관리', titleEn: 'Language Academy Management',
    subKo: '출석 · 숙제 · 학부모 알림 · 결제',
    descKo: '강사·학생·학부모 3-way 워크플로우 + 자동 출결 알림',
    descEn: 'Three-way teacher / student / parent workflow with auto attendance alerts',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    mockup: {
      brand: 'AcademyOne', logoIcon: '✎', domain: 'manager.academyone.kr', accent: '#f59e0b',
      ticker: [
        { tone: 'live', label: '수업중', text: '중2-A반 · 14:00-15:30 · 출석 12/14' },
        { tone: 'info', label: '결제',   text: '5월 수강료 완납 87% (132/152)' },
      ],
      menu: [
        { name: '오늘 시간표', tag: '8교시', active: true },
        { name: '학생 관리',   tag: '152명' },
        { name: '출결 관리',   tag: '자동' },
        { name: '숙제·테스트', tag: '24개' },
        { name: '학부모 소통', tag: '알림' },
        { name: '결제 관리',   tag: '월별' },
      ],
      stats: [
        { label: '오늘 수업', value: '8', unit: '교시' },
        { label: '재원 학생', value: '152', unit: '명' },
        { label: '결제 완료', value: '87%', unit: '' },
        { label: '학부모 만족', value: '★4.8', unit: '' },
      ],
      actions: ['출석 체크', '숙제 등록', '학부모 알림'],
      notices: [
        { type: '안내', title: '5월 정기시험 일정 — 5/24 토요일' },
        { type: '결제', title: '6월 수강료 결제 안내 자동 발송' },
        { type: '신규', title: '여름방학 특강 등록 시작' },
      ],
      hint: '출결·숙제·결제 모든 알림이 학부모 카카오톡으로 전송됩니다.',
    },
  }),
  r({
    slug: 'coding-school', cat: 'education',
    titleKo: '온라인 코딩 스쿨', titleEn: 'Online Coding School',
    subKo: '강의 영상 · 실습 · 멘토 매칭 · 수료증',
    descKo: '동영상 강의 + 코드 실습 환경 + 1:1 멘토링 매칭',
    descEn: 'Video lessons + in-browser coding + 1:1 mentor matching + certificates',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    mockup: {
      brand: 'CodeSchool', logoIcon: '</>', domain: 'learn.codeschool.io', accent: '#06b6d4',
      ticker: [
        { tone: 'live', label: '진행중', text: '실시간 멘토링 24개 세션' },
        { tone: 'info', label: '신규',   text: 'React 19 신규 강좌 오픈' },
      ],
      menu: [
        { name: '내 학습',     tag: '진행중 3', active: true },
        { name: '강의 카탈로그', tag: '142개' },
        { name: '코드 실습',   tag: 'IDE' },
        { name: '멘토 매칭',   tag: '24명' },
        { name: '수료증·뱃지', tag: '보관함' },
        { name: '커뮤니티',     tag: '포럼' },
      ],
      stats: [
        { label: '수강생',       value: '8,420', unit: '명' },
        { label: '진행 강좌',     value: '142',   unit: '개' },
        { label: '활성 멘토',     value: '24',    unit: '명' },
        { label: '수료율',       value: '78%',   unit: '' },
      ],
      actions: ['강의 계속하기', '실습 시작', '멘토 예약'],
      notices: [
        { type: '신규', title: 'React 19 풀스택 부트캠프 모집 시작' },
        { type: '이벤트', title: '5월 코딩 챌린지 — 상금 50만원' },
        { type: '인터뷰', title: '수료생 취업 후기 인터뷰' },
      ],
      hint: '브라우저 안에서 코드 작성·실행·테스트까지 모두 가능.',
    },
  }),

  // ============ F&B ============
  r({
    slug: 'bakery-chain', cat: 'fnb',
    titleKo: '베이커리 체인 주문 포털', titleEn: 'Bakery Chain Ordering',
    subKo: '매장 예약 · 케이크 디자인 주문 · 픽업 알림',
    descKo: '커스텀 케이크 주문(디자인 첨부) + 매장별 픽업 시간 조율',
    descEn: 'Custom cake orders with design upload + per-store pickup scheduling',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    mockup: {
      brand: 'BakeryHaus', logoIcon: '🥐', domain: 'order.bakeryhaus.kr', accent: '#f59e0b',
      ticker: [
        { tone: 'live', label: '오늘', text: '주문 28건 · 픽업 대기 12건' },
        { tone: 'info', label: '신규', text: '커스텀 케이크 디자인 의뢰 3건' },
      ],
      menu: [
        { name: '주문 현황',   tag: '28건', active: true },
        { name: '메뉴 관리',   tag: '142개' },
        { name: '커스텀 주문', tag: '3건' },
        { name: '매장 관리',   tag: '8지점' },
        { name: '재고·발주',   tag: '재고' },
        { name: '회원·쿠폰',   tag: '4,210' },
      ],
      stats: [
        { label: '오늘 주문', value: '28', unit: '건' },
        { label: '픽업 대기', value: '12', unit: '건' },
        { label: '매출',     value: '₩1.4M', unit: '' },
        { label: '재방문율', value: '64%', unit: '' },
      ],
      actions: ['주문 접수', '커스텀 보기', '픽업 알림'],
      notices: [
        { type: '커스텀', title: '5/25 결혼식 — 3단 케이크 의뢰' },
        { type: '재고', title: '카카오 매스 발주 필요' },
        { type: '이벤트', title: '어버이날 카네이션 케이크 한정 출시' },
      ],
      hint: '주문 완료부터 픽업까지 모든 단계가 카카오톡 알림으로.',
    },
  }),
  r({
    slug: 'wine-bar-membership', cat: 'fnb',
    titleKo: '와인바 멤버십', titleEn: 'Wine Bar Membership',
    subKo: '룸 예약 · 시즌 이벤트 · 취향 기반 와인 추천',
    descKo: '회원 등급 + 룸별 예약 + AI 와인 추천 + 시음회 알림',
    descEn: 'Tiered membership, room booking, AI wine pairing, and tasting events',
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    mockup: {
      brand: 'CelloWine', logoIcon: '🍷', domain: 'member.cellowine.kr', accent: '#9f1239',
      ticker: [
        { tone: 'live', label: '오늘 밤', text: '예약 만석 · 워크인 대기 2팀' },
        { tone: 'info', label: '이벤트', text: '부르고뉴 시음회 5/22 — 8석 남음' },
      ],
      menu: [
        { name: '오늘 예약',   tag: '12팀', active: true },
        { name: '룸 캘린더',   tag: '주간' },
        { name: '멤버십',     tag: 'Gold 124' },
        { name: '와인 셀러',   tag: '482종' },
        { name: '시음 이벤트', tag: '월 2회' },
        { name: 'AI 추천',     tag: '신규' },
      ],
      stats: [
        { label: '오늘 예약', value: '12', unit: '팀' },
        { label: '활성 멤버', value: '482', unit: '명' },
        { label: '와인 보유', value: '482', unit: '종' },
        { label: '월 매출',   value: '₩28M', unit: '' },
      ],
      actions: ['예약 확인', '와인 추천', '이벤트 등록'],
      notices: [
        { type: '이벤트', title: '부르고뉴 시음회 5/22 (8/12석)' },
        { type: '입고', title: 'Pinot Noir 2018 빈티지 신규 입고' },
        { type: '멤버', title: 'Gold 등급 승급 안내 (3명)' },
      ],
      hint: '취향·예산을 입력하면 AI가 셀러에서 최적 페어링 추천.',
    },
  }),

  // ============ 부동산/건축 ============
  r({
    slug: 'signature-realty', cat: 'realestate',
    titleKo: '시그니처 부동산', titleEn: 'Signature Real Estate',
    subKo: '매물 리스팅 · 계약 관리 · 임대 수익 대시보드',
    descKo: '매물 등록(이미지·평면도·가상투어) + 임대·계약 워크플로우',
    descEn: 'Listings with floor plans and virtual tours + leasing workflow',
    img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    mockup: {
      brand: 'Signature', logoIcon: '⌂', domain: 'agent.signature.kr', accent: '#10b981',
      ticker: [
        { tone: 'live', label: '문의', text: '신규 문의 8건 · 평균 응답 12분' },
        { tone: 'info', label: '계약', text: '이번 주 계약 완료 4건' },
      ],
      menu: [
        { name: '대시보드',     tag: '오늘', active: true },
        { name: '매물 관리',   tag: '142개' },
        { name: '계약 관리',   tag: '진행 12' },
        { name: '고객 CRM',     tag: '4,820' },
        { name: '임대 수익',   tag: '월간' },
        { name: '광고·홍보',   tag: '채널' },
      ],
      stats: [
        { label: '활성 매물', value: '142', unit: '개' },
        { label: '진행 계약', value: '12',  unit: '건' },
        { label: '신규 문의', value: '28',  unit: '건' },
        { label: '월 수익',   value: '₩48M', unit: '' },
      ],
      actions: ['매물 등록', '문의 응답', '계약서 작성'],
      notices: [
        { type: '신규', title: '강남 OO동 신축 빌라 등록 (3건)' },
        { type: '계약', title: '5/22 계약 예정 — 잠실 OO아파트' },
        { type: '시세', title: '5월 시세 리포트 발행 완료' },
      ],
      hint: '가상투어 링크 한 번에 전송 + 계약서 전자서명 지원.',
    },
  }),
  r({
    slug: 'architecture-studio', cat: 'realestate',
    titleKo: '건축사무소 포트폴리오', titleEn: 'Architecture Studio',
    subKo: '프로젝트 갤러리 · 전문 분야 · 견적 상담',
    descKo: '편집·설계 사례를 우아하게 보여주는 에디토리얼 포트폴리오',
    descEn: 'Editorial-style portfolio for editorial and design projects',
    img: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&q=80',
    mockup: {
      brand: 'NoorArchi', logoIcon: '△', domain: 'studio.noor.archi', accent: '#0f172a',
      ticker: [
        { tone: 'live', label: '진행중', text: '6개 프로젝트 · 견적 의뢰 3건' },
        { tone: 'info', label: '수상', text: 'Red Dot Design Award 2025' },
      ],
      menu: [
        { name: '스튜디오 소개', tag: '', active: true },
        { name: '프로젝트',     tag: '42개' },
        { name: '전문 분야',     tag: '6개' },
        { name: '저널·생각',     tag: '에세이' },
        { name: '견적·상담',     tag: '문의' },
        { name: '연락처',       tag: '' },
      ],
      stats: [
        { label: '완료 프로젝트', value: '42', unit: '개' },
        { label: '진행중',       value: '6',  unit: '개' },
        { label: '수상',         value: '11', unit: '회' },
        { label: '인용 매체',     value: '24', unit: '곳' },
      ],
      actions: ['프로젝트 보기', '견적 의뢰', '스튜디오 소개'],
      notices: [
        { type: '수상', title: 'Red Dot Design Award 2025 Best of Best' },
        { type: '저널', title: '주거의 새로운 정의 — 에세이 발행' },
        { type: '강연', title: 'SADI 게스트 강연 (5/24)' },
      ],
      hint: '에디토리얼 톤의 갤러리 + 차분한 타이포로 작품을 돋보이게.',
    },
  }),

  // ============ 뷰티/패션 ============
  r({
    slug: 'hair-salon-booking', cat: 'beauty',
    titleKo: '헤어살롱 예약 시스템', titleEn: 'Hair Salon Booking',
    subKo: '디자이너 매칭 · 스타일 추천 · 시술 후 관리',
    descKo: '디자이너별 포트폴리오 + 시술 메뉴 + 카카오/문자 알림',
    descEn: 'Per-stylist portfolios, service menu, and Kakao/SMS notifications',
    img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    mockup: {
      brand: 'Salon.', logoIcon: '✂', domain: 'book.salon-noir.kr', accent: '#a855f7',
      ticker: [
        { tone: 'live', label: '시술중', text: '8명 디자이너 · 가용 2석' },
        { tone: 'info', label: '예약',   text: '오늘 14건 · 내일 22건' },
      ],
      menu: [
        { name: '오늘 시술',   tag: 'LIVE', active: true },
        { name: '예약 캘린더', tag: '주간' },
        { name: '디자이너',     tag: '8명' },
        { name: '시술 메뉴',   tag: '단가' },
        { name: '고객 관리',   tag: '1,420' },
        { name: '재방문 추적', tag: '리마인더' },
      ],
      stats: [
        { label: '오늘 예약', value: '14', unit: '건' },
        { label: '내일 예약', value: '22', unit: '건' },
        { label: '신규 고객', value: '3',  unit: '명' },
        { label: '재방문율', value: '68%', unit: '' },
      ],
      actions: ['예약 추가', '디자이너 보기', '리마인더 발송'],
      notices: [
        { type: '디자이너', title: 'OO 디자이너 5/24 휴무' },
        { type: '신메뉴', title: '여름 펌 신메뉴 출시' },
        { type: '리뷰', title: '구글 리뷰 ★4.9 / 248건' },
      ],
      hint: '예약 6시간 전 자동 리마인더, 시술 후 사진 자동 저장.',
    },
  }),
  r({
    slug: 'fashion-select', cat: 'beauty',
    titleKo: '패션 셀렉트샵', titleEn: 'Fashion Select Shop',
    subKo: '룩북 · 온라인 스토어 · 구독 큐레이션',
    descKo: '시즌 룩북 + 풀스택 커머스 + 월 구독 박스 큐레이션',
    descEn: 'Seasonal lookbooks + full-stack store + monthly subscription curation',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    mockup: {
      brand: 'Atelier.Shop', logoIcon: '◆', domain: 'admin.atelier.shop', accent: '#a855f7',
      ticker: [
        { tone: 'live', label: '주문', text: '오늘 주문 24건 · 출고 대기 8건' },
        { tone: 'info', label: '구독', text: '5월 큐레이션 박스 발송 완료 (482건)' },
      ],
      menu: [
        { name: '대시보드',     tag: '오늘', active: true },
        { name: '상품 관리',   tag: '842개' },
        { name: '주문·배송',   tag: '24건' },
        { name: '구독 큐레이션', tag: '482명' },
        { name: '룩북·콘텐츠', tag: '시즌' },
        { name: '회원·CRM',     tag: '4,820' },
      ],
      stats: [
        { label: '오늘 매출', value: '₩2.8M', unit: '' },
        { label: '주문',     value: '24',   unit: '건' },
        { label: '구독자',   value: '482',  unit: '명' },
        { label: '재구매율', value: '54%',  unit: '' },
      ],
      actions: ['상품 등록', '주문 처리', '룩북 발행'],
      notices: [
        { type: '입고', title: 'SS26 시즌 신상품 입고 안내' },
        { type: '리뷰', title: '인스타그램 협찬 후기 모음' },
        { type: '구독', title: '6월 큐레이션 박스 콘셉트 확정' },
      ],
      hint: '구독 박스 매월 자동 큐레이션 + 회원 취향 분석 리포트.',
    },
  }),

  // ============ 스타트업/SaaS ============
  r({
    slug: 'ai-meeting-notes', cat: 'saas',
    titleKo: 'AI 회의록 서비스', titleEn: 'AI Meeting Notes',
    subKo: '녹음 · 자동 요약 · 공유 · 검색',
    descKo: '회의 녹음을 AI가 요약하고 발언자별 검색 가능한 아카이브로',
    descEn: 'Record meetings, AI-summarize, and search by speaker',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    mockup: {
      brand: 'NoteAI', logoIcon: '⌥', domain: 'app.noteai.co', accent: '#06b6d4',
      ticker: [
        { tone: 'live', label: '처리중', text: '회의 3건 트랜스크립트 생성중' },
        { tone: 'info', label: '신규',   text: 'GPT-4o 모델 적용 — 정확도 ↑' },
      ],
      menu: [
        { name: '내 회의록',   tag: '482개', active: true },
        { name: '실시간 녹음', tag: '대기' },
        { name: '공유 받은',   tag: '24개' },
        { name: '검색',       tag: '⌘K' },
        { name: '팀 워크스페이스', tag: '4팀' },
        { name: '통합·연동',   tag: 'Zoom·Slack' },
      ],
      stats: [
        { label: '총 회의록',   value: '482', unit: '개' },
        { label: '이번 주 녹음', value: '24', unit: '시간' },
        { label: '평균 요약',   value: '4.2', unit: '초' },
        { label: '검색 정확도', value: '94%', unit: '' },
      ],
      actions: ['새 회의 시작', '파일 업로드', '검색'],
      notices: [
        { type: '신규', title: 'GPT-4o 모델 적용 — 한국어 정확도 향상' },
        { type: '연동', title: 'Notion · Slack 자동 공유 지원' },
        { type: '가이드', title: '효과적인 회의 진행법 가이드' },
      ],
      hint: '회의 끝나면 5초 안에 핵심 요약 + 액션 아이템 자동 추출.',
    },
  }),
  r({
    slug: 'project-collab-tool', cat: 'saas',
    titleKo: '프로젝트 협업 툴', titleEn: 'Project Collaboration Tool',
    subKo: '칸반 · 시간 추적 · 팀 리포트',
    descKo: '드래그 가능한 칸반 + 시간 트래커 + 주간 자동 리포트',
    descEn: 'Drag-and-drop kanban + time tracking + auto weekly reports',
    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    mockup: {
      brand: 'KanFlow', logoIcon: '◰', domain: 'app.kanflow.io', accent: '#6366f1',
      ticker: [
        { tone: 'live', label: '진행중', text: '활성 작업 28개 · 마감 임박 4개' },
        { tone: 'info', label: '신규',   text: 'AI 작업 우선순위 자동 정렬' },
      ],
      menu: [
        { name: '칸반 보드',   tag: '메인', active: true },
        { name: '내 작업',     tag: '12개' },
        { name: '캘린더',     tag: '주간' },
        { name: '시간 추적',   tag: '타이머' },
        { name: '리포트',     tag: '주간' },
        { name: '팀 관리',     tag: '8명' },
      ],
      stats: [
        { label: '활성 작업', value: '28', unit: '개' },
        { label: '진행률',   value: '67%', unit: '' },
        { label: '이번 주 시간', value: '142', unit: '시간' },
        { label: '마감 임박', value: '4',  unit: '개' },
      ],
      actions: ['새 작업', '타이머 시작', '리포트 생성'],
      notices: [
        { type: '마감', title: '디자인 시스템 v2 — 5/22 마감' },
        { type: '리뷰', title: 'PR #248 리뷰 대기' },
        { type: '리포트', title: '5월 3주차 팀 리포트 발행' },
      ],
      hint: '시간 추적·진행률·리포트가 모든 작업에서 자동 집계.',
    },
  }),

  // ============ 운영/도구 (project demos) ============
  r({
    slug: 'cafe24-kakao-alimtalk', cat: 'tools',
    titleKo: '카페24 알림톡 통합', titleEn: 'Cafe24 + KakaoTalk',
    subKo: '주문/배송/장바구니 자동 카톡 + 광고추적',
    descKo: '카페24 사장님 화면 · 주문/배송/장바구니/재입고 4종 템플릿 + 폰 미리보기 + GA4/Meta Pixel/KakaoBiz 이벤트 동시 발사',
    descEn: 'Cafe24 admin with 4 alimtalk templates, live phone preview, and synced GA4 / Meta Pixel / KakaoBiz event firing',
    img: 'https://images.unsplash.com/photo-1556742212-5b321f3c261b?w=800&q=80',
    template: 'project', demoKey: 'cafe24',
    mockup: { accent: '#6366f1' },
  }),
  r({
    slug: 'ai-content-automation', cat: 'tools',
    titleKo: 'AI 콘텐츠 자동화', titleEn: 'AI Content Automation',
    subKo: 'RSS·노션·스크립트 → Claude → 쇼츠 발행',
    descKo: '3-column 파이프라인 (Source → Engine → Output) · 쇼츠 썸네일 클릭 시 큐와 소스가 cross-column highlight',
    descEn: '3-column pipeline (Source → Engine → Output). Clicking a Shorts thumbnail traces back to the queue and feed.',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    template: 'project', demoKey: 'aiflow',
    mockup: { accent: '#8b5cf6' },
  }),
  r({
    slug: 'api-integrations-hub', cat: 'tools',
    titleKo: 'API 연동 허브', titleEn: 'API Integrations Hub',
    subKo: '결제·메시징·분석·CRM 한 화면 운영',
    descKo: '10개 통합 카드 (토스·아임포트·카카오비즈·NCloud·GA4·Meta·Slack·Notion·Mailchimp·S3) + webhook·토큰·이벤트 로그 detail panel',
    descEn: '10 integration cards with webhook URL, masked token, and recent event log in a per-card detail panel.',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    template: 'project', demoKey: 'integrations',
    mockup: { accent: '#0ea5e9' },
  }),
  r({
    slug: 'multi-channel-commerce', cat: 'tools',
    titleKo: '다국어 커머스 채널', titleEn: 'Multi-channel Commerce',
    subKo: '한·중·일·미 4채널 통합 운영',
    descKo: '한국 자사몰 · Tmall · Rakuten · Shopify Plus 동시 연결 · 한 상품 마스터로 4채널 가격/재고/번역 + 혼합 언어 주문 피드',
    descEn: 'KR self-store, Tmall, Rakuten, Shopify Plus connected. One master syncs prices/stock/translation; mixed-language order feed.',
    img: 'https://images.unsplash.com/photo-1535350356005-fd52b3b524fb?w=800&q=80',
    template: 'project', demoKey: 'multichannel',
    mockup: { accent: '#10b981' },
  }),
  r({
    slug: 'booking-reminders', cat: 'tools',
    titleKo: '예약 알리미 대시보드', titleEn: 'Booking & Reminders',
    subKo: '캘린더 + 카톡/SMS 자동 알림',
    descKo: '시간대별 슬롯 + 선택된 예약 detail + 알리미 큐 (카톡/SMS) · 노쇼율 14% → 2.4% 가는 운영 도구',
    descEn: 'Per-hour calendar + booking detail card + reminder queue (KakaoTalk / SMS). No-show rate from 14% to 2.4%.',
    img: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80',
    template: 'project', demoKey: 'booking',
    mockup: { accent: '#f59e0b' },
  }),

  // ============ 비영리 ============
  r({
    slug: 'env-ngo-platform', cat: 'nonprofit',
    titleKo: '환경NGO 후원 플랫폼', titleEn: 'Environmental NGO Platform',
    subKo: '캠페인 · 정기후원 · 임팩트 리포트 · 뉴스레터',
    descKo: '캠페인 페이지(스토리텔링) + 정기 결제 + 후원자 임팩트 리포트',
    descEn: 'Story-driven campaigns, recurring donations, and donor impact reports',
    img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
    mockup: {
      brand: 'GreenEarth', logoIcon: '☘', domain: 'admin.greenearth.org', accent: '#14b8a6',
      ticker: [
        { tone: 'live', label: '캠페인', text: '바다 정화 — 목표 82% 달성' },
        { tone: 'info', label: '후원',   text: '오늘 신규 정기후원 12명' },
      ],
      menu: [
        { name: '대시보드',     tag: '오늘', active: true },
        { name: '캠페인 관리', tag: '진행 4' },
        { name: '후원자',       tag: '4,820' },
        { name: '임팩트 리포트', tag: '월간' },
        { name: '뉴스레터',     tag: '발송' },
        { name: '자원봉사',     tag: '신청' },
      ],
      stats: [
        { label: '월 후원금', value: '₩28M', unit: '' },
        { label: '정기 후원자', value: '482', unit: '명' },
        { label: '진행 캠페인', value: '4',  unit: '개' },
        { label: '뉴스레터 구독', value: '12k', unit: '' },
      ],
      actions: ['캠페인 만들기', '후원자 관리', '리포트 발행'],
      notices: [
        { type: '캠페인', title: '바다 정화 캠페인 — 목표 82%' },
        { type: '리포트', title: '4월 임팩트 리포트 발행 완료' },
        { type: '행사', title: '6월 환경의 날 자원봉사 모집' },
      ],
      hint: '후원자에게 매월 \"내 후원금이 만든 변화\" 자동 리포트.',
    },
  }),
  r({
    slug: 'social-enterprise-impact', cat: 'nonprofit',
    titleKo: '사회적기업 임팩트 포털', titleEn: 'Social Enterprise Impact Portal',
    subKo: '활동 기록 · 성과 지표 · 연차 보고서',
    descKo: '연도별 임팩트 시각화 + 후원자 보고 + 자료실 운영',
    descEn: 'Yearly impact visualization, donor reporting, and document library',
    img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
    mockup: {
      brand: 'Impactly', logoIcon: '◎', domain: 'portal.impactly.kr', accent: '#14b8a6',
      ticker: [
        { tone: 'live', label: '활동', text: '진행중 프로젝트 8개' },
        { tone: 'info', label: '보고', text: '2025 연차보고서 발간 완료' },
      ],
      menu: [
        { name: '임팩트 대시보드', tag: '오늘', active: true },
        { name: '프로젝트',       tag: '8개' },
        { name: '성과 지표',       tag: 'KPI' },
        { name: '후원자·파트너', tag: '142개' },
        { name: '자료실',         tag: '문서' },
        { name: '연차 보고서',   tag: '연간' },
      ],
      stats: [
        { label: '수혜자',       value: '12,420', unit: '명' },
        { label: '활동 시간',     value: '24k',    unit: '시간' },
        { label: '파트너',       value: '142',    unit: '곳' },
        { label: '임팩트 점수',   value: '8.4',    unit: '/10' },
      ],
      actions: ['활동 기록', 'KPI 입력', '보고서 생성'],
      notices: [
        { type: '보고', title: '2025 연차보고서 발간 — PDF 다운로드' },
        { type: '파트너', title: '신규 파트너십 — OO재단' },
        { type: '인증', title: '사회적기업 인증 갱신 완료' },
      ],
      hint: '활동을 입력하면 KPI·리포트·차트가 자동으로 업데이트.',
    },
  }),
];

export function findReference(slug) {
  return REFERENCES.find(r => r.slug === slug);
}
