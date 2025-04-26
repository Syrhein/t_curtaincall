const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ 이름 변경 API
router.post('/update-name', async (req, res) => {
  try {
    const userSession = req.session.user; // 세션에서 로그인 정보 가져오기

    if (!userSession) {
      return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
    }

    const { newUserName } = req.body;

    if (!newUserName || newUserName.trim() === '') {
      return res.status(400).json({ success: false, message: '새 이름을 입력해주세요.' });
    }

    // DB 업데이트 실행
    await db.query(
      'UPDATE TB_USER SET USER_NAME = ? WHERE USER_ID = ?',
      [newUserName, userSession.id]
    );

    // 세션 정보도 함께 업데이트
    req.session.user.name = newUserName;

    res.json({ success: true });

  } catch (error) {
    console.error('❌ 이름 변경 오류:', error.message);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

module.exports = router;
