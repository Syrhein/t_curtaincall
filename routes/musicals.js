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

// 공연 상세 조회
router.get('/:musicalId/:showIdx', async (req, res) => {
    const { musicalId, showIdx } = req.params;
  
    try {
      const [rows] = await db.query(`
        SELECT 
          M.MUSICAL_ID AS musicalId,
          M.MUSICAL_TITLE AS musicalTitle,
          M.MUSICAL_POSTER AS musicalPoster,
          M.MUSICAL_CAST AS musicalCast,
          M.MUSICAL_LICENSE AS musicalLicense,
          M.MUSICAL_CREATE AS musicalCreate,
          S.SHOW_IDX AS showIdx,
          S.HALL_NAME AS hallName,
          S.SHOW_DT AS showDt,
          S.SHOW_RUNTIME AS showRuntime,
          S.SHOW_PRICE AS showPrice,
          S.SHOW_IMGS AS showImgs,
          S.SHOW_VIEWS AS showViews
        FROM TB_MUSICAL M
        JOIN TB_SHOW S ON M.MUSICAL_ID = S.MUSICAL_ID
        WHERE M.MUSICAL_ID = ? AND S.SHOW_IDX = ?
        LIMIT 1
      `, [musicalId, showIdx]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: '해당 공연을 찾을 수 없습니다.' });
      }
  
      res.json(rows[0]);
    } catch (err) {
      console.error('❌ 상세 조회 오류:', err.message);
      res.status(500).json({ message: '서버 오류' });
    }
  });
  

  // 📌 조회수 증가 라우터 추가
router.post('/views', async (req, res) => {
    const { musicalId } = req.body;
  
    if (!musicalId) {
      return res.status(400).json({ message: '뮤지컬 ID가 필요합니다.' });
    }
  
    try {
      const [result] = await db.query(`
        UPDATE TB_SHOW
        SET SHOW_VIEWS = IFNULL(SHOW_VIEWS, 0) + 1
        WHERE MUSICAL_ID = ?
      `, [musicalId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '해당 뮤지컬을 찾을 수 없습니다.' });
      }
  
      res.json({ message: '조회수 증가 성공' });
    } catch (err) {
      console.error('❌ 조회수 증가 실패:', err.message);
      res.status(500).json({ message: '서버 오류' });
    }
  });
  



module.exports = router;
