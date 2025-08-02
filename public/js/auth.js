// Supabase 클라이언트 초기화 (환경변수는 서버에서 전달받음)
let supabaseClient = null;

// 인증 상태 관리
let currentUser = null;
let authToken = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 로컬 스토리지에서 토큰 확인
    authToken = localStorage.getItem('authToken');
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (authToken && currentUser) {
        updateUIForLoggedInUser();
    }
});

// 회원가입 처리
async function handleSignup(event) {
    event.preventDefault();
    
    const signupId = document.getElementById('signupId').value.trim();
    const signupPassword = document.getElementById('signupPassword').value;
    const signupName = document.getElementById('signupName').value.trim();
    const signupPhone = document.getElementById('signupPhone').value.trim();
    
    // 입력값 검증
    if (!signupId || !signupPassword || !signupName || !signupPhone) {
        showMessage('모든 필드를 입력해주세요.', 'error');
        return;
    }
    
    if (signupPassword.length < 6) {
        showMessage('비밀번호는 6자 이상이어야 합니다.', 'error');
        return;
    }
    
    // 연락처 유효성 검사 (숫자와 하이픈만)
    const phonePattern = /^[0-9-]+$/;
    if (!phonePattern.test(signupPhone)) {
        showMessage('연락처는 숫자와 하이픈만 입력 가능합니다.', 'error');
        return;
    }
    
    // 연락처 길이 검사
    if (signupPhone.length < 10 || signupPhone.length > 13) {
        showMessage('올바른 연락처 형식을 입력해주세요. (예: 010-1234-5678)', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                signupId,
                signupPassword,
                signupName,
                signupPhone
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 로그인 정보 저장
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMessage('회원가입이 완료되었습니다!', 'success');
            updateUIForLoggedInUser();
            showSection('home');
        } else {
            showMessage(data.message || '회원가입에 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('네트워크 오류가 발생했습니다.', 'error');
    } finally {
        showLoading(false);
    }
}

// 로그인 처리
async function handleLogin(event) {
    event.preventDefault();
    
    const loginId = document.getElementById('loginId').value.trim();
    const loginPassword = document.getElementById('loginPassword').value;
    
    if (!loginId || !loginPassword) {
        showMessage('아이디와 비밀번호를 입력해주세요.', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loginId,
                loginPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 로그인 정보 저장
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMessage(`${currentUser.name}님 환영합니다!`, 'success');
            updateUIForLoggedInUser();
            showSection('home');
        } else {
            showMessage(data.message || '로그인에 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('네트워크 오류가 발생했습니다.', 'error');
    } finally {
        showLoading(false);
    }
}

// 로그아웃 처리
function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    updateUIForLoggedOutUser();
    showMessage('로그아웃되었습니다.', 'info');
    showSection('home');
}

// 로그인된 사용자를 위한 UI 업데이트
function updateUIForLoggedInUser() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && currentUser) {
        navLinks.innerHTML = `
            <li><a href="#" onclick="showSection('home')">홈</a></li>
            <li><a href="#" onclick="showSection('portfolio')">포트폴리오</a></li>
            <li><a href="#" onclick="showProfile()">${currentUser.name}님</a></li>
            <li><a href="#" onclick="handleLogout()">로그아웃</a></li>
        `;
    }
}

// 로그아웃된 사용자를 위한 UI 업데이트
function updateUIForLoggedOutUser() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.innerHTML = `
            <li><a href="#" onclick="showSection('home')">홈</a></li>
            <li><a href="#" onclick="showSection('portfolio')">포트폴리오</a></li>
            <li><a href="#" onclick="showSection('login')">로그인</a></li>
        `;
    }
}

// 프로필 정보 표시
async function showProfile() {
    if (!authToken) {
        showSection('login');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const user = data.user;
            alert(`프로필 정보\\n\\n아이디: ${user.user_id}\\n이름: ${user.name}\\n연락처: ${user.phone}\\n가입일: ${new Date(user.created_at).toLocaleDateString()}`);
        } else {
            showMessage('프로필 정보를 불러올 수 없습니다.', 'error');
            handleLogout();
        }
    } catch (error) {
        console.error('Profile error:', error);
        showMessage('네트워크 오류가 발생했습니다.', 'error');
    }
}

// 메시지 표시
function showMessage(message, type = 'info') {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;
    
    // 스타일 적용
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        transition: all 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(45deg, #00ff88, #00cc6a);' : ''}
        ${type === 'error' ? 'background: linear-gradient(45deg, #ff4444, #cc3333);' : ''}
        ${type === 'info' ? 'background: linear-gradient(45deg, #0080ff, #0066cc);' : ''}
    `;
    
    document.body.appendChild(messageDiv);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }
    }, 3000);
}

// 로딩 상태 표시
function showLoading(show) {
    const buttons = document.querySelectorAll('.auth-button');
    buttons.forEach(button => {
        if (show) {
            button.disabled = true;
            button.textContent = '처리 중...';
        } else {
            button.disabled = false;
            if (button.form && button.form.id === 'loginForm') {
                button.textContent = '로그인';
            } else {
                button.textContent = '회원가입';
            }
        }
    });
}

// 폼 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 폼
    const loginForm = document.querySelector('#loginForm form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 회원가입 폼
    const signupForm = document.querySelector('#signupForm form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // 연락처 입력 제한 (실시간)
    const phoneInput = document.getElementById('signupPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // 숫자와 하이픈만 허용
            this.value = this.value.replace(/[^0-9-]/g, '');
        });
        
        phoneInput.addEventListener('keypress', function(e) {
            // 숫자(0-9)와 하이픈(-)만 허용
            const char = String.fromCharCode(e.which);
            if (!/[0-9-]/.test(char)) {
                e.preventDefault();
            }
        });
    }
});

// Enter 키 지원
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeForm = document.querySelector('#loginForm:not([style*="display: none"]) form, #signupForm:not([style*="display: none"]) form');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
});