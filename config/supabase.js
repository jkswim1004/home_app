const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 설정
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL과 ANON KEY가 필요합니다. .env 파일을 확인해주세요.');
}

// 일반 클라이언트 (브라우저용)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서비스 롤 클라이언트 (서버용 - 모든 권한)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
    supabase,
    supabaseAdmin
};