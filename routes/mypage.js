const express = require('express');
const router = express.Router();
const pool = require('../db');  // db.js에 설정된 MySQL pool 연결

// ✅ 즐겨찾기 목록 조회 API
router.get('/favorites', async (req, res) => {
    try {
      const userSession = req.session.user;
  
      if (!userSession) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }
  
      const userId = userSession.id;
  
      const [favorites] = await pool.query(`
        SELECT 
          m.MUSICAL_ID,
          m.MUSICAL_TITLE,
          s.SHOW_IDX,
          DATE_FORMAT(m.MUSICAL_ST_DT, '%Y-%m-%d') AS startDate,
          DATE_FORMAT(m.MUSICAL_ED_DT, '%Y-%m-%d') AS endDate
        FROM 
          tb_favorite f
        JOIN 
          tb_show s ON f.SHOW_IDX = s.SHOW_IDX
        JOIN 
          tb_musical m ON s.MUSICAL_ID = m.MUSICAL_ID
        WHERE 
          f.USER_ID = ?
        ORDER BY 
          m.MUSICAL_ST_DT ASC
      `, [userId]);
      
      const formattedFavorites = favorites.map(item => ({
        musicalId: item.MUSICAL_ID,
        musicalTitle: item.MUSICAL_TITLE,
        showIdx: item.SHOW_IDX,
        startDate: item.startDate, 
        endDate: item.endDate      
      }));
      
      res.json(formattedFavorites);
      

    } catch (error) {
      console.error('즐겨찾기 목록 조회 오류:', error);
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

  

// ✅ 내가 작성한 게시글 목록 조회 API
router.get('/posts', async (req, res) => {
    try {
      const userSession = req.session.user;
  
      if (!userSession) {
        return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
      }
  
      const [posts] = await pool.query(`
        SELECT 
          POST_IDX AS postIdx,
          POST_TITLE AS postTitle,
          DATE_FORMAT(CREATED_AT, '%Y-%m-%d') AS createdAt
        FROM 
          tb_post
        WHERE 
          USER_ID = ?
        ORDER BY 
          CREATED_AT DESC
      `, [userSession.id]);
  
      res.json(posts);
  
    } catch (error) {
      console.error('❌ 게시글 목록 조회 오류:', error.message);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
  });

// ✅ 내가 작성한 리뷰 목록 조회 API
router.get('/reviews', async (req, res) => {
    try {
      const userSession = req.session.user;
  
      if (!userSession) {
        return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
      }
  
      const [reviews] = await pool.query(`
        SELECT 
          m.MUSICAL_TITLE AS musicalTitle,
          s.MUSICAL_ID AS musicalId,
          s.SHOW_IDX AS showIdx,
          DATE_FORMAT(r.CREATED_AT, '%Y-%m-%d') AS createdAt
        FROM 
          tb_review r
        JOIN 
          tb_show s ON r.SHOW_IDX = s.SHOW_IDX
        JOIN 
          tb_musical m ON s.MUSICAL_ID = m.MUSICAL_ID
        WHERE 
          r.USER_ID = ?
        ORDER BY 
          r.CREATED_AT DESC
      `, [userSession.id]);
  
      res.json(reviews);
  
    } catch (error) {
      console.error('❌ 리뷰 목록 조회 오류:', error.message);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
  });
  
  


module.exports = router;
