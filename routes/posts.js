const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// ✅ 업로드 경로 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ 게시글 전체 조회
router.get('/', async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT POST_IDX AS postIdx, POST_TITLE AS postTitle, USER_NAME AS userName,
             CREATED_AT AS createdAt, POST_VIEWS AS postViews
      FROM TB_POST
      ORDER BY CREATED_AT DESC
    `);
    res.json(posts);
  } catch (err) {
    console.error('❌ 게시글 목록 조회 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 게시글 상세 조회
router.get('/:postIdx', async (req, res) => {
  const { postIdx } = req.params;
  try {
    const [[post]] = await db.query(`
      SELECT * FROM TB_POST WHERE POST_IDX = ?
    `, [postIdx]);

    if (!post) return res.status(404).json({ error: '게시글이 존재하지 않습니다.' });

    // 조회수 증가
    await db.query(`UPDATE TB_POST SET POST_VIEWS = POST_VIEWS + 1 WHERE POST_IDX = ?`, [postIdx]);

    res.json(post);
  } catch (err) {
    console.error('❌ 게시글 상세 조회 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 게시글 등록
router.post('/', upload.single('postFile'), async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: '로그인이 필요합니다.' });

  const { postTitle, postContent } = req.body;
  const file = req.file;

  try {
    await db.query(`
      INSERT INTO TB_POST (POST_TITLE, POST_CONTENT, POST_FILE_NAME, POST_FILE_PATH, USER_ID, USER_NAME)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      postTitle,
      postContent,
      file?.originalname || null,
      file?.filename || null,
      user.id,
      user.name
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ 게시글 등록 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 게시글 수정
router.put('/:postIdx', upload.single('postFile'), async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: '로그인이 필요합니다.' });

  const { postIdx } = req.params;
  const { postTitle, postContent } = req.body;
  const file = req.file;

  try {
    // 권한 확인
    const [[post]] = await db.query(`SELECT * FROM TB_POST WHERE POST_IDX = ?`, [postIdx]);
    if (!post || post.USER_ID !== user.id) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

    // 파일이 있으면 경로 포함 업데이트
    await db.query(`
      UPDATE TB_POST 
      SET POST_TITLE = ?, POST_CONTENT = ?, 
          POST_FILE_NAME = ?, POST_FILE_PATH = ?
      WHERE POST_IDX = ?
    `, [
      postTitle,
      postContent,
      file?.originalname || post.POST_FILE_NAME,
      file?.filename || post.POST_FILE_PATH,
      postIdx
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error('❌ 게시글 수정 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 게시글 삭제
router.delete('/:postIdx', async (req, res) => {
  const user = req.session.user;
  const { postIdx } = req.params;
  if (!user) return res.status(401).json({ error: '로그인이 필요합니다.' });

  try {
    const [[post]] = await db.query(`SELECT * FROM TB_POST WHERE POST_IDX = ?`, [postIdx]);
    if (!post || post.USER_ID !== user.id) {
      return res.status(403).json({ error: '삭제 권한이 없습니다.' });
    }

    await db.query(`DELETE FROM TB_POST WHERE POST_IDX = ?`, [postIdx]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ 게시글 삭제 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
