# Future Portfolio - AI 시대 취준생 포트폴리오 사이트

Supabase를 활용한 회원가입/로그인 기능이 있는 모던 포트폴리오 웹사이트입니다.

## 📋 프로젝트 개요

- **기술 스택**: Node.js, Express, Supabase, HTML/CSS/JavaScript
- **배포**: Vercel
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
`.env` 파일을 생성하고 다음 값들을 설정하세요:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
NODE_ENV=production
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
└── vercel.json           # Vercel 배포 설정
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

#### 3.3 환경변수 설정
1. Vercel 프로젝트 설정에서 "Environment Variables" 클릭
2. 다음 환경변수들을 추가:

| Name | Value | Description |
|------|-------|-------------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 프로젝트 URL |
| `SUPABASE_ANON_KEY` | `eyJxxx...` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJxxx...` | Supabase service role key |
| `JWT_SECRET` | `your-secret-key-123` | JWT 암호화 키 (랜덤 문자열) |

3. "Deploy" 클릭

#### 3.4 도메인 설정 (선택사항)
1. "Settings" → "Domains" 클릭
2. 커스텀 도메인 추가 또는 제공된 `.vercel.app` 도메인 사용

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

#### 4. 로그인이 안되는 경우
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

**🎉 성공적인 배포를 위해 각 단계를 차근차근 따라해보세요!**