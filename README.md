# Future Portfolio - AI 시대 취준생 포트폴리오 사이트

Supabase를 활용한 회원가입/로그인 기능이 있는 모던 포트폴리오 웹사이트입니다.

## 📋 프로젝트 개요

- **기술 스택**: Node.js, Express, Supabase, HTML/CSS/JavaScript
- **배포**: Vercel, Render
- **데이터베이스**: Supabase PostgreSQL
- **인증**: JWT + Supabase

## 🚀 빠른 시작

### 1. 프로젝트 클론 및 설치
```bash
git clone <your-repository-url>
cd home_app
npm install
```

### 2. 환경변수 설정
`.env.example` 파일을 복사해서 `.env` 파일을 생성하고 실제 값으로 변경하세요:
```bash
# .env 파일 생성
touch .env

# .env 파일에 다음 내용 추가:
echo "SUPABASE_URL=https://your-project.supabase.co" >> .env
echo "SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env
echo "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key" >> .env
echo "JWT_SECRET=your_jwt_secret_key_here" >> .env
echo "PORT=3000" >> .env
echo "NODE_ENV=development" >> .env
```

### 3. 로컬 실행
```bash
npm start
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 📁 프로젝트 구조

```
home_app/
├── api/
│   └── index.js          # Vercel 서버리스 함수 엔트리포인트
├── config/
│   └── supabase.js       # Supabase 설정
├── public/
│   ├── js/
│   │   └── auth.js       # 프론트엔드 인증 로직
│   └── index.html        # 메인 HTML 파일
├── routes/
│   └── auth.js           # 인증 API 라우트
├── .env.example          # 환경변수 예시 파일
├── .gitignore            # Git 무시 파일
├── package.json          # 프로젝트 의존성
├── server.js             # Express 서버 설정
├── vercel.json           # Vercel 배포 설정
└── render.yaml           # Render 배포 설정
```

## 🔧 상세 설정 가이드

### **【단계 1: Supabase 설정】**

#### 1.1 Supabase 계정 생성
1. [Supabase 웹사이트](https://supabase.com)에 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인 (권장)
4. 새 프로젝트 생성

#### 1.2 데이터베이스 테이블 생성
1. Supabase 대시보드에서 "SQL Editor" 클릭
2. 다음 SQL 쿼리 실행:

```sql
-- users 테이블 생성
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### 1.3 API 키 확인
1. Supabase 대시보드에서 "Settings" → "API" 클릭
2. 다음 값들을 복사해서 `.env` 파일에 저장:
   - **URL**: Project URL
   - **anon public**: anon key
   - **service_role**: service_role key (비밀!)

#### 1.4 보안 설정 (중요!)
1. "Authentication" → "Settings" 클릭
2. "Site URL" 설정:
   - 로컬: `http://localhost:3000`
   - 배포후: `https://your-app-name.vercel.app`

### **【단계 2: GitHub 설정】**

#### 2.1 GitHub 리포지토리 생성
1. [GitHub](https://github.com)에서 새 리포지토리 생성
2. 리포지토리명: `future-portfolio` (원하는 이름)
3. Public 또는 Private 선택
4. README.md 포함하지 않음 (이미 있음)

#### 2.2 코드 푸시
```bash
# Git 초기화 (최초 1회만)
git init

# 원격 저장소 연결
git remote add origin https://github.com/your-username/your-repository-name.git

# 파일 추가 및 커밋
git add .
git commit -m "Initial commit: Portfolio with Supabase auth"

# GitHub에 푸시
git push -u origin main
```

### **【단계 3: Vercel 배포】**

#### 3.1 Vercel 계정 생성
1. [Vercel](https://vercel.com)에 접속
2. "Continue with GitHub" 클릭
3. GitHub 계정으로 로그인

#### 3.2 프로젝트 배포
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 리포지토리 선택
3. 프로젝트 설정:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동 설정)
   - **Output Directory**: `public` (자동 설정)

#### 3.3 환경변수 설정 (중요!)
1. Vercel 프로젝트 설정에서 "Environment Variables" 클릭
2. 다음 환경변수들을 **실제 값으로** 추가:

| Name | Value 예시 | Description |
|------|-------|-------------|
| `SUPABASE_URL` | `https://zppdcivnpcfwpsxvkzgd.supabase.co` | Supabase 프로젝트 URL |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase service role key |
| `JWT_SECRET` | `your-secret-key-123` | JWT 암호화 키 (랜덤 문자열) |

⚠️ **중요한 Vercel 환경변수 설정 방법**:
- `vercel.json`의 `@supabase_url` 형태는 Vercel Secret 참조용입니다
- 실제 환경변수 설정에서는 `@` 없이 **실제 값**을 직접 입력하세요
- 예: `SUPABASE_URL` → `https://zppdcivnpcfwpsxvkzgd.supabase.co`
- Secret 변수는 선택사항이며, 직접 환경변수 설정만으로도 배포 가능합니다

3. "Deploy" 클릭

#### 3.4 도메인 설정 (선택사항)
1. "Settings" → "Domains" 클릭
2. 커스텀 도메인 추가 또는 제공된 `.vercel.app` 도메인 사용

### **【단계 4: Render 배포 (대안)】**

Vercel 대신 Render를 사용하여 배포할 수도 있습니다.

#### 4.1 Render 계정 생성
1. [Render](https://render.com)에 접속
2. "Get Started for Free" 클릭
3. GitHub 계정으로 로그인

#### 4.2 웹 서비스 생성
1. Render 대시보드에서 "New +" → "Web Service" 클릭
2. GitHub 리포지토리 연결
3. 프로젝트 설정:
   - **Name**: `future-portfolio` (원하는 이름)
   - **Environment**: `Node`
   - **Region**: `Singapore` (한국과 가장 가까움)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### 4.3 환경변수 설정
"Environment Variables" 섹션에서 다음 변수들을 추가:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | `https://zppdcivnpcfwpsxvkzgd.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `JWT_SECRET` | `your-secret-key-123` |

#### 4.4 배포 완료
1. "Create Web Service" 클릭
2. 배포 완료까지 2-3분 대기
3. 제공된 `.onrender.com` URL로 접속하여 테스트

#### 4.5 Render vs Vercel 비교

| 기능 | Vercel | Render |
|------|--------|--------|
| **무료 플랜** | 100GB 대역폭 | 750시간/월 |
| **콜드 스타트** | 빠름 | 보통 |
| **커스텀 도메인** | ✅ | ✅ |
| **자동 배포** | ✅ | ✅ |
| **서버 항상 실행** | ❌ (서버리스) | ✅ |
| **설정 복잡도** | 낮음 | 낮음 |

**추천**: 
- 간단한 정적 사이트 → **Vercel**
- 서버가 항상 실행되어야 하는 경우 → **Render**

## 🔐 보안 고려사항

### **【중요 보안 설정】**

1. **환경변수 보안**
   - `.env` 파일은 절대 GitHub에 커밋하지 마세요
   - `.gitignore`에 `.env`가 포함되어 있는지 확인하세요

2. **Supabase RLS (Row Level Security)**
   ```sql
   -- users 테이블에 RLS 활성화
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   
   -- 사용자는 자신의 정보만 조회 가능
   CREATE POLICY "Users can view own profile" ON users
       FOR SELECT USING (auth.uid()::text = user_id);
   ```

3. **JWT Secret**
   - 강력한 랜덤 문자열 사용
   - 주기적으로 변경 권장

## 🧪 테스트

### 로컬 테스트
1. 서버 실행: `npm start`
2. 브라우저에서 `http://localhost:3000` 접속
3. 회원가입/로그인 테스트

### 배포 테스트
1. Vercel 도메인에 접속
2. 모든 기능이 정상 작동하는지 확인

## 🔧 문제 해결

### **【일반적인 문제들】**

#### 1. "Cannot connect to Supabase" 오류
- Supabase URL과 API 키가 올바른지 확인
- 네트워크 연결 상태 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

#### 2. "Table 'users' doesn't exist" 오류
- Supabase SQL Editor에서 테이블 생성 쿼리 실행
- 테이블명 대소문자 확인

#### 3. Vercel 배포 실패
- `vercel.json` 파일 구문 확인
- 환경변수가 모두 설정되어 있는지 확인
- 빌드 로그에서 오류 메시지 확인
- SUPABASE_URL 설정 시 `@supabase_url`이 아닌 실제 URL 값 사용

#### 4. Render 배포 실패
- 환경변수가 모두 설정되어 있는지 확인
- Start Command가 `npm start`로 설정되어 있는지 확인
- 빌드 로그에서 오류 메시지 확인
- PORT 환경변수는 Render에서 자동 설정되므로 따로 설정 불필요

#### 5. 로그인이 안되는 경우
- 네트워크 탭에서 API 요청 확인
- 콘솔에서 JavaScript 오류 확인
- 서버 로그 확인

## 📊 모니터링

### Supabase 모니터링
- Database → Logs: 데이터베이스 쿼리 로그
- API → Logs: API 요청 로그
- Auth → Users: 가입 사용자 목록

### Vercel 모니터링
- Functions → Logs: 서버 함수 로그
- Analytics: 사용자 통계
- Speed Insights: 성능 분석

### Render 모니터링
- Logs: 실시간 서버 로그
- Metrics: CPU, 메모리 사용량
- Events: 배포 히스토리

## 🚀 추가 기능 아이디어

1. **이메일 인증**
   - Supabase Auth 이메일 인증 활용
   
2. **소셜 로그인**
   - Google, GitHub 로그인 추가
   
3. **프로필 이미지**
   - Supabase Storage 활용
   
4. **비밀번호 재설정**
   - 이메일 기반 패스워드 리셋

## 📝 라이선스

MIT License

---

## 💬 지원

문제가 있거나 도움이 필요하시면:
1. GitHub Issues에 문제 등록
2. Supabase 공식 문서 참조
3. Vercel 문서 참조
4. Render 문서 참조

## 🎯 배포 플랫폼 선택 가이드

### Vercel (추천 - 정적 사이트/서버리스)
- ✅ 빠른 배포와 CDN
- ✅ GitHub 자동 배포
- ✅ 무료 SSL 인증서  
- ❌ 서버리스 환경 (콜드 스타트)

### Render (추천 - 항상 실행 서버)
- ✅ 서버 항상 실행
- ✅ 무료 플랜 제공
- ✅ 쉬운 환경변수 설정
- ❌ 콜드 스타트 시간 존재

**🎉 성공적인 배포를 위해 각 단계를 차근차근 따라해보세요!**