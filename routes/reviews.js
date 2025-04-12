const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ 리뷰 목록 조회
router.get('/', async (req, res) => {
    const { showIdx } = req.query;

    try {
        const [reviews] = await db.query(`
      SELECT 
        R.REVIEW_IDX AS reviewIdx,
        R.SHOW_IDX AS showIdx,
        R.REVIEW_CONTENT AS reviewContent,
        R.REVIEW_STAR AS reviewStar,
        R.CREATED_AT AS createdAt,
        U.USER_ID AS userId,
        U.USER_NAME AS userName
      FROM TB_REVIEW R
      JOIN TB_USER U ON R.USER_ID = U.USER_ID
      WHERE R.SHOW_IDX = ?
      ORDER BY R.CREATED_AT DESC
    `, [showIdx]);

        res.json(reviews);
    } catch (err) {
        console.error('❌ 리뷰 목록 조회 실패:', err.message);
        res.status(500).json({ error: '서버 오류' });
    }
});

// ✅ 리뷰 작성
router.post('/', async (req, res) => {
    const { reviewContent, reviewStar, showIdx } = req.body;
    const user = req.session.user;
  
    if (!user) return res.status(401).json({ error: '로그인이 필요합니다.' });
  
    if (!reviewContent || reviewContent.trim().length === 0 || reviewContent.length > 1000) {
      return res.status(400).json({ error: '리뷰 내용이 비어있거나 너무 깁니다.' });
    }
  
    try {
      // ⭐ 형변환 보장
      const showIdxInt = parseInt(showIdx);
      const starInt = parseInt(reviewStar);
  
      await db.query(`
        INSERT INTO TB_REVIEW (SHOW_IDX, USER_ID, REVIEW_CONTENT, REVIEW_STAR)
        VALUES (?, ?, ?, ?)
      `, [showIdxInt, user.id, reviewContent.trim(), starInt]);
  
      res.json({ success: true });

    } catch (err) {
      console.error('❌ 리뷰 작성 실패:', err.message);
      res.status(500).json({ error: '서버 오류' });
    }
  });
  



// ✅ 리뷰 삭제
router.delete('/:reviewIdx', async (req, res) => {
    const { reviewIdx } = req.params;
    const user = req.session.user;

    if (!user) return res.status(401).json({ error: '로그인이 필요합니다.' });

    try {
        // 본인 확인
        const [rows] = await db.query(`
      SELECT * FROM TB_REVIEW
      WHERE REVIEW_IDX = ? AND USER_ID = ?
    `, [reviewIdx, user.id]);

        if (rows.length === 0) {
            return res.status(403).json({ error: '삭제 권한이 없습니다.' });
        }

        await db.query(`DELETE FROM TB_REVIEW WHERE REVIEW_IDX = ?`, [reviewIdx]);
        res.json({ success: true });

    } catch (err) {
        console.error('❌ 리뷰 삭제 실패:', err.message);
        res.status(500).json({ error: '서버 오류' });
    }
});

// ✅ 평균 평점 조회
router.get('/average', async (req, res) => {
    const { showIdx } = req.query;

    try {
        const [rows] = await db.query(`
        SELECT AVG(REVIEW_STAR) AS averageStar
        FROM TB_REVIEW
        WHERE SHOW_IDX = ?
      `, [showIdx]);

        res.json({ averageStar: rows[0].averageStar ?? 0 }); // null일 경우 0 반환
    } catch (err) {
        console.error('❌ 평균 평점 조회 실패:', err.message);
        res.status(500).json({ error: '서버 오류' });
    }
});

// ✅ 리뷰 수정
router.put('/:reviewIdx', async (req, res) => {
    const { reviewContent, reviewStar, showIdx, userId } = req.body;
    const { reviewIdx } = req.params;

    if (!userId) return res.status(401).json({ error: '로그인이 필요합니다.' });

    try {
        const [existing] = await db.query(`
        SELECT * FROM TB_REVIEW WHERE REVIEW_IDX = ? AND USER_ID = ?
      `, [reviewIdx, userId]);

        if (existing.length === 0) {
            return res.status(403).json({ error: '수정 권한이 없습니다.' });
        }

        await db.query(`
        UPDATE TB_REVIEW SET REVIEW_CONTENT = ?, REVIEW_STAR = ? WHERE REVIEW_IDX = ?
      `, [reviewContent.trim(), reviewStar, reviewIdx]);

        res.json({ success: true });

    } catch (err) {
        console.error('❌ 리뷰 수정 실패:', err.message);
        res.status(500).json({ error: '서버 오류' });
    }
});




module.exports = router;
