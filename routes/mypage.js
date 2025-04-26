const express = require('express');
const router = express.Router();
const pool = require('../db');  // db.js에 설정된 MySQL pool 연결

// ✅ 즐겨찾기 목록 조회 API
router.get('/favorites', async (req, res) => {
  try {
    const userId = req.session.userId;  // 세션에서 로그인한 유저 ID 확인

    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const [favorites] = await pool.query(`
      SELECT 
        m.MUSICAL_ID,
        m.MUSICAL_TITLE,
        s.SHOW_IDX,
        s.SHOW_DT
      FROM 
        tb_favorite f
      JOIN 
        tb_show s ON f.SHOW_IDX = s.SHOW_IDX
      JOIN 
        tb_musical m ON s.MUSICAL_ID = m.MUSICAL_ID
      WHERE 
        f.USER_ID = ?
      ORDER BY 
        s.SHOW_DT ASC
    `, [userId]);

    res.json(favorites);

  } catch (error) {
    console.error('즐겨찾기 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
