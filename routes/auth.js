const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase, supabaseAdmin } = require('../config/supabase');

const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
    try {
        const { signupId, signupPassword, signupName, signupPhone } = req.body;

        // 입력값 검증
        if (!signupId || !signupPassword || !signupName || !signupPhone) {
            return res.status(400).json({ 
                success: false, 
                message: '모든 필드를 입력해주세요.' 
            });
        }

        // 비밀번호 길이 확인
        if (signupPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: '비밀번호는 6자 이상이어야 합니다.' 
            });
        }

        // 연락처 유효성 검사 (숫자와 하이픈만)
        const phonePattern = /^[0-9-]+$/;
        if (!phonePattern.test(signupPhone)) {
            return res.status(400).json({ 
                success: false, 
                message: '연락처는 숫자와 하이픈만 입력 가능합니다.' 
            });
        }

        // 연락처 길이 검사
        if (signupPhone.length < 10 || signupPhone.length > 13) {
            return res.status(400).json({ 
                success: false, 
                message: '올바른 연락처 형식을 입력해주세요. (예: 010-1234-5678)' 
            });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(signupPassword, 10);

        // Supabase에 사용자 데이터 저장
        const { data, error } = await supabaseAdmin
            .from('users')
            .insert([
                {
                    user_id: signupId,
                    password: hashedPassword,
                    name: signupName,
                    phone: signupPhone,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            
            // 중복 사용자 체크
            if (error.code === '23505') {
                return res.status(400).json({ 
                    success: false, 
                    message: '이미 존재하는 아이디입니다.' 
                });
            }
            
            return res.status(500).json({ 
                success: false, 
                message: '회원가입 중 오류가 발생했습니다.' 
            });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: signupId, name: signupName },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            user: {
                id: signupId,
                name: signupName,
                phone: signupPhone
            },
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { loginId, loginPassword } = req.body;

        // 입력값 검증
        if (!loginId || !loginPassword) {
            return res.status(400).json({ 
                success: false, 
                message: '아이디와 비밀번호를 입력해주세요.' 
            });
        }

        // 사용자 조회
        const { data: users, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('user_id', loginId)
            .single();

        if (error || !users) {
            return res.status(401).json({ 
                success: false, 
                message: '아이디 또는 비밀번호가 잘못되었습니다.' 
            });
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(loginPassword, users.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: '아이디 또는 비밀번호가 잘못되었습니다.' 
            });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: users.user_id, name: users.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 마지막 로그인 시간 업데이트
        await supabaseAdmin
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('user_id', loginId);

        res.json({
            success: true,
            message: '로그인이 완료되었습니다.',
            user: {
                id: users.user_id,
                name: users.name,
                phone: users.phone
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 사용자 정보 조회 (토큰 인증 필요)
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: '인증이 필요합니다.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('user_id, name, phone, created_at, last_login')
            .eq('user_id', decoded.userId)
            .single();

        if (error || !user) {
            return res.status(401).json({ 
                success: false, 
                message: '사용자를 찾을 수 없습니다.' 
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(401).json({ 
            success: false, 
            message: '유효하지 않은 토큰입니다.' 
        });
    }
});

module.exports = router;