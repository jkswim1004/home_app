const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// API 라우트
app.use('/api/auth', require('./routes/auth'));

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 처리
app.use((req, res) => {
    res.status(404).json({ error: '페이지를 찾을 수 없습니다.' });
});

// 에러 처리
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

// 서버 시작
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
        console.log(`📁 정적 파일: ${path.join(__dirname, 'public')}`);
    });
}

module.exports = app;