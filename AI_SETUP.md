# FeedON Gemini 무료 API 연결

## 현재 구성

- 공급자는 Google Gemini입니다. 이전 공급자 호출과 자동 유료 대체는 없습니다.
- 새 프로젝트에 제공되는 `gemini-3.8-flash` 텍스트 생성만 사용합니다. 도구·검색·이미지·파일 업로드는 사용하지 않습니다.
- 운영 기간은 한국 시간 2026-12-31까지. 공용 총 100회·하루 20회·분당 3회를 제한합니다. 기존 사용 기록을 유지합니다.
- 무료 API 한도가 끝나면 기존 로컬 제안을 유지합니다. 자동 재시도하지 않습니다.
- 무료 여부는 **키가 속한 Google 프로젝트의 Cloud Billing 상태**로 결정됩니다. 요청에 무료 결제를 강제하는 매개변수는 없습니다. 운영자가 나중에 결제를 연결하면 코드만으로 과금을 막는다고 보장할 수 없습니다.

## 설정

1. Google AI Studio에서 Cloud Billing이 연결되지 않은 전용 프로젝트를 선택합니다. 학교 계정의 관리 정책과 외부 전송 허용 여부를 확인합니다. 카드 등록·결제 연결·유료 업그레이드는 하지 않습니다.
2. API 키 화면에서 프로젝트가 **Free tier**인지 확인하고 서버용 키를 발급합니다. 키를 채팅·공개 저장소·VITE_ 변수에 넣지 않습니다.
3. Vercel Production 전용 Secret 변수:
   - `GEMINI_API_KEY`
   - `GEMINI_FREE_TIER_CONFIRMED=true` — 무료 상태 확인 후에만 설정. 이 값 자체가 Google 결제 상태를 실시간 조회하는 기능은 아닙니다.
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — 기존 무료 저장소. 카드·자동 업그레이드 없음.
   - `AI_ENABLED=true` — 연결·무료 상태·전송 안내 검토 후 설정.
4. 기존 운영 주소에 재배포하고 개인정보 없는 예시로 1회 확인합니다. 중지는 `AI_ENABLED=false` 설정 후 재배포합니다.
5. 이전 공급자의 키와 환경변수는 제거합니다. Git 기록에 비밀값은 포함하지 않습니다.

## 개인정보

- 무료 Gemini 입력·응답은 Google 제품 개선에 사용되며 사람이 검토할 수 있습니다. 약관상 개인정보·민감정보·기밀정보를 전송하지 않습니다.
- 이름만 지워도 다른 맥락으로 학생을 알아볼 수 있습니다. 특정 학생을 식별할 수 없는 가상/재구성 수업 예시만 사용하고 전송 전 검토합니다.
- 화면에 Google Gemini 사용, 전송 항목, 무료 서비스 처리 조건 및 동의를 표시합니다. 완전 비밀 보장·학습 미사용이라고 표시하지 않습니다.
- 앱은 입력·결과를 DB나 서버 로그에 기록하지 않습니다. Upstash에는 횟수와 중복 방지 ID만 저장합니다. 호스팅 접근 로그와 Google의 처리·보관은 별도입니다.
- 원본 연구 PDF/HWP 전체는 전송하지 않습니다. 기존 공개 코드의 네 가지 재구성 사례와 5단계 원칙을 참고합니다. 전체 자료를 학습했다거나 정확도를 보장한다고 표시하지 않습니다.
- 이용 코드 없이 공개 이용하므로 교사 외 방문자도 한도를 소모할 수 있습니다.

## 확인

`node --test src/feedbackEngine.test.js server/aiFeedback.test.js`

`npm run build` / `npm run lint`

모의 테스트는 외부 API를 호출하지 않습니다. 실제 사용 가능 모델과 무료 한도는 계정에 따라 달라질 수 있습니다.

## 공식 참고

- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/terms
- https://ai.google.dev/api/generate-content
- https://upstash.com/docs/redis/features/restapi
