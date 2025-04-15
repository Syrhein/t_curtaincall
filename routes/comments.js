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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
  
    try {
      // 전체 개수 조회
      const [countRows] = await db.query(
        `SELECT COUNT(*) AS total FROM TB_COMMENT WHERE POST_IDX = ?`,
        [postId]
      );
      const totalCount = countRows[0].total;
  
      // 페이징된 댓글 조회
      const [commentRows] = await db.query(`
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
        LIMIT ? OFFSET ?
      `, [postId, limit, offset]);
  
      res.json({
        comments: commentRows,
        totalCount,
        page,
        limit
      });
    } catch (err) {
      console.error('댓글 페이징 조회 오류:', err);
      res.status(500).json({ error: '서버 오류' });
    }
  });
  
  
  // ✅ 댓글 삭제
router.delete('/:commentId', async (req, res) => {
    const { commentId } = req.params;
  
    try {
      const sql = `
        DELETE FROM TB_COMMENT
        WHERE CMT_IDX = ?
      `;
      const [result] = await db.query(sql, [commentId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "댓글이 존재하지 않음" });
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error('댓글 삭제 오류:', err);
      res.status(500).json({ error: '서버 오류' });
    }
  });

// ✅ 댓글 수정
router.put('/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
  
    if (!content) {
      return res.status(400).json({ error: "내용이 비어있습니다." });
    }
  
    try {
      const sql = `
        UPDATE TB_COMMENT
        SET CMT_CONTENT = ?
        WHERE CMT_IDX = ?
      `;
      const [result] = await db.query(sql, [content, commentId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "댓글이 존재하지 않음" });
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error("댓글 수정 오류:", err);
      res.status(500).json({ error: "서버 오류" });
    }
  });
  
  
  

module.exports = router;
