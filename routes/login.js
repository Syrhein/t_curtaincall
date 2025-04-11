const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ 로그인 요청 처리 (POST)
router.post('/', async (req, res) => {
  const { userId, userPw } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM TB_USER WHERE USER_ID = ? AND USER_PW = ?',
      [userId, userPw]
    );

    if (rows.length > 0) {
      req.session.user = {
        id: rows[0].USER_ID,
        name: rows[0].USER_NAME
      };
      res.json({ success: true, message: '로그인 성공' });
    } else {
      res.status(401).json({ success: false, message: 'ID 또는 비밀번호가 틀렸습니다' });
    }
  } catch (err) {
    console.error('❌ 로그인 오류:', err.message);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// ✅ 로그인 상태 확인 (GET)
router.get('/status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// ✅ 로그아웃 (GET)
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: '로그아웃 실패' });
    }
    res.json({ success: true, message: '로그아웃 완료' });
  });
});

module.exports = router;
