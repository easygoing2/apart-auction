# 옥션홈

지역별 아파트 법원경매 물건을 쉽고 빠르게 탐색할 수 있는 웹사이트입니다.

배포 사이트:

- [GitHub Pages](https://easygoing2.github.io/apart-auction/)
- [OpenAI Sites](https://auction-home-korea.topgun8127.chatgpt.site)

## 주요 기능

- 시·도와 시·군·구가 연동되는 지역 검색
- 최저매각가격과 유찰 횟수 필터
- 매각기일, 최저가, 할인율 기준 정렬
- 관심 물건 저장
- 경매물건 상세 정보 확인
- 모바일과 데스크톱 반응형 화면
- 대한민국 법원경매 공식 사이트 연결

> 현재 포함된 물건 정보는 서비스 시연을 위한 예시 데이터입니다. 실제 입찰 전에는 반드시 대한민국 법원경매의 사건 공고를 확인해야 합니다.

## 로컬 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인할 수 있습니다.

## 검증

```bash
npm run build
npm run build:pages
```

GitHub Pages를 포함한 개발·검증·자동 배포 과정은 [GitHub Pages 배포 흐름](docs/GITHUB_PAGES_FLOW.md)에 자세히 정리되어 있습니다.

## 기술 구성

- React 19
- TypeScript
- vinext / Vite
- Cloudflare Workers 호환 빌드
- OpenAI Sites 배포

## 데이터 출처 안내

화면의 데이터 항목은 대한민국 법원경매에서 제공하는 사건번호, 법원, 감정평가액, 최저매각가격, 매각기일 등의 공개 정보 구조를 참고해 설계했습니다. 라이브 데이터 수집 기능은 아직 연결되어 있지 않습니다.
