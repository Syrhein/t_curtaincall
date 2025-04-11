const express = require('express');
const router = express.Router();
const db = require('../db');

// 관심 등록 여부 확인
router.get('/', async (req, res) => {
  const { userId, showIdx } = req.query;

  try {
    const [rows] = await db.query(`
      SELECT * FROM TB_FAVORITE
      WHERE USER_ID = ? AND SHOW_IDX = ?
    `, [userId, showIdx]);

    res.json({ isFavorite: rows.length > 0 });
  } catch (err) {
    console.error('❌ 관심 상태 확인 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 관심 등록/해제
router.post('/', async (req, res) => {
  const { userId, showIdx, action } = req.body;

  try {
    if (action === 'add') {
      await db.query(`
        INSERT INTO TB_FAVORITE (USER_ID, SHOW_IDX)
        VALUES (?, ?)
      `, [userId, showIdx]);
    } else if (action === 'remove') {
      await db.query(`
        DELETE FROM TB_FAVORITE
        WHERE USER_ID = ? AND SHOW_IDX = ?
      `, [userId, showIdx]);
    } else {
      return res.status(400).json({ error: '잘못된 action 파라미터' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('❌ 관심 등록/해제 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
