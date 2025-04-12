const express = require('express');
const router = express.Router();
const db = require('../db');

// 슬라이드용 공연 데이터 제공 (포스터, 제목, id 등)
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
      ORDER BY S.SHOW_VIEWS DESC
      LIMIT 5
    `);

    res.json(rows);
  } catch (err) {
    console.error('❌ 슬라이드 API 오류:', err.message);
    res.status(500).json({ message: '서버 오류' });
  }
});


module.exports = router;
