# 🤖 AI News Notion Bot

매일 AI 뉴스를 조사하고, 매주 월요일 주간 TOP 10을 선정하여 노션에 자동으로 업로드하는 시스템입니다.

## 🛠️ 사전 준비

### 1. Notion 데이터베이스 생성
노션에서 새 데이터베이스(표 보기 추천)를 만들고 다음 **속성(Property)**을 정확한 이름과 유형으로 추가하세요.

| 속성 이름 | 유형 | 비고 |
| :--- | :--- | :--- |
| **이름** | 제목 (Title) | 기본 생성됨 |
| **날짜** | 날짜 (Date) | |
| **분류** | 선택 (Select) | `Daily`, `Weekly` 옵션 추가 |
| **URL** | URL | |
| **요약** | 텍스트 (Rich Text) | |

### 2. API 키 발급
- **Gemini API Key**: [Google AI Studio](https://aistudio.google.com/)
- **Tavily API Key**: [Tavily AI](https://tavily.com/)
- **Notion Token**: [Notion My Integrations](https://www.notion.so/my-integrations)에서 '프라이빗 통합' 생성
    - 생성 후 '기능' 탭에서 **'콘텐츠 업데이트'**, **'콘텐츠 읽기'** 권한이 있는지 확인하세요.
    - **중요**: 생성한 노션 페이지 오른쪽 상단 `...` -> `연결 대상` -> 내가 만든 통합 이름을 선택하여 **페이지 접근 권한을 명시적으로 부여**해야 합니다.

## ⚙️ 설정 방법

1. 프로젝트 루트 폴더에 `.env` 파일을 만듭니다.
2. `.env.example`의 내용을 복사하여 아래와 같이 채웁니다.

```env
GEMINI_API_KEY=your_key
TAVILY_API_KEY=your_key
NOTION_TOKEN=your_token
NOTION_DATABASE_ID=your_db_id
```

## 🚀 실행 방법

### 로컬에서 테스트
```bash
node index.js
```

### 자동화 (GitHub Actions)
1. GitHub 저장소(Repository)를 만듭니다.
2. `Settings > Secrets and variables > Actions`에 위 4가지 환경변수를 등록합니다.
3. 코드를 Push하면 매일 아침 9시(KST)에 자동으로 실행됩니다.
