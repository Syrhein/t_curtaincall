const express = require('express');
const router = express.Router();
const db = require('../db');

// 공연 전체 리스트 제공
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        S.SHOW_IDX AS showIdx,
        M.MUSICAL_ID AS musicalId,
        M.MUSICAL_TITLE AS musicalTitle,
        M.MUSICAL_POSTER AS musicalPoster
      FROM TB_MUSICAL M
      JOIN TB_SHOW S ON M.MUSICAL_ID = S.MUSICAL_ID
      ORDER BY S.SHOW_IDX DESC
      LIMIT 100
    `);

    res.json(rows);
  } catch (err) {
    console.error('❌ 공연 목록 조회 실패:', err.message);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
