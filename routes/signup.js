// routes/signup.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 회원가입 요청 처리
router.post('/', async (req, res) => {
  const { userId, userPw, userName, userEmail, userTel } = req.body;

  try {
    // 아이디 중복 확인
    const [existing] = await db.query('SELECT * FROM TB_USER WHERE USER_ID = ?', [userId]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: '이미 사용 중인 아이디입니다' });
    }

    // INSERT
    await db.query(`
      INSERT INTO TB_USER (USER_ID, USER_PW, USER_NAME, USER_EMAIL, USER_TEL)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, userPw, userName, userEmail, userTel]);

    res.json({ success: true, message: '회원가입 완료' });
  } catch (err) {
    console.error('❌ 회원가입 오류:', err.message);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

module.exports = router;
