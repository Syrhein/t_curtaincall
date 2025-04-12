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
    await db.query(`
      INSERT INTO TB_REVIEW (SHOW_IDX, USER_ID, REVIEW_CONTENT, REVIEW_STAR)
      VALUES (?, ?, ?, ?)
    `, [showIdx, user.id, reviewContent.trim(), reviewStar]);

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

module.exports = router;
