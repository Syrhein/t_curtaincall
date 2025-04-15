const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL 연결 모듈 경로 맞춰줘

// ✅ 댓글 작성
router.post('/', async (req, res) => {
    const { postId, userId, content } = req.body;
    if (!postId || !userId || !content) {
      return res.status(400).json({ error: "필수 항목 누락" });
    }
  
    try {
      const sql = `
        INSERT INTO TB_COMMENT (POST_IDX, USER_ID, CMT_CONTENT)
        VALUES (?, ?, ?)
      `;
      await db.query(sql, [postId, userId, content]);
      res.status(201).json({ success: true });
    } catch (err) {
      console.error('댓글 작성 오류:', err);
      res.status(500).json({ error: '서버 오류' });
    }
  });
  

// ✅ 특정 게시글의 댓글 조회
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
      const sql = `
        SELECT 
          c.CMT_IDX AS commentId,
          c.CMT_CONTENT AS content,
          c.CREATED_AT AS createdAt,
          c.USER_ID AS userId,
          u.USER_NAME AS userName
        FROM TB_COMMENT c
        JOIN TB_USER u ON c.USER_ID = u.USER_ID
        WHERE c.POST_IDX = ?
        ORDER BY c.CREATED_AT ASC
      `;
      const [rows] = await db.query(sql, [postId]);
      res.json(rows);
    } catch (err) {
      console.error('댓글 조회 오류:', err);
      res.status(500).json({ error: '서버 오류' });
    }
  });
  
  

module.exports = router;
