// Vercel 배포를 위한 서버리스 함수 엔트리포인트
const app = require('../server');

// Vercel에서 serverless function으로 실행되도록 export
module.exports = app;