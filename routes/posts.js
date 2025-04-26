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
    // 👉 한글 깨짐 방지를 위해 파일명을 utf-8로 변환
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const uniqueName = Date.now() + '_' + originalName;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ 게시글 전체 조회
router.get('/', async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT 
        POST_IDX AS postIdx, 
        POST_TITLE AS postTitle, 
        USER_NAME AS userName,
        CREATED_AT AS createdAt, 
        POST_VIEWS AS postViews,
        POST_LIKES AS postLikes   -- ✅ 이 줄 추가!
      FROM TB_POST
      ORDER BY CREATED_AT DESC
    `);
    res.json(posts);
  } catch (err) {
    console.error('❌ 게시글 목록 조회 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

// ✅ 게시글 상세 조회 (camelCase alias 적용됨!)
router.get('/:postIdx', async (req, res) => {
  const { postIdx } = req.params;
  try {
    const [[post]] = await db.query(`
      SELECT 
        POST_IDX AS postIdx,
        POST_TITLE AS postTitle,
        POST_CONTENT AS postContent,
        POST_FILE_NAME AS postFileName,
        POST_FILE_PATH AS postFilePath,
        CREATED_AT AS createdAt,
        POST_VIEWS AS postViews,
        POST_LIKES AS postLikes,
        USER_ID AS userId,
        USER_NAME AS userName
      FROM TB_POST 
      WHERE POST_IDX = ?
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
    const [[post]] = await db.query(`SELECT * FROM TB_POST WHERE POST_IDX = ?`, [postIdx]);
    if (!post || post.USER_ID !== user.id) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

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

// ✅ 게시글 좋아요
router.post('/:postId/like', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    // 이미 좋아요를 눌렀는지 확인
    const [existing] = await db.query(
      `SELECT * FROM TB_POST_LIKES WHERE POST_IDX = ? AND USER_ID = ?`,
      [postId, userId]
    );

    if (existing.length > 0) {
      // 좋아요 취소
      await db.query(`DELETE FROM TB_POST_LIKES WHERE POST_IDX = ? AND USER_ID = ?`, [postId, userId]);
      await db.query(`UPDATE TB_POST SET POST_LIKES = POST_LIKES - 1 WHERE POST_IDX = ?`, [postId]);
      return res.json({ liked: false });
    } else {
      // 좋아요 추가
      await db.query(`INSERT INTO TB_POST_LIKES (POST_IDX, USER_ID) VALUES (?, ?)`, [postId, userId]);
      await db.query(`UPDATE TB_POST SET POST_LIKES = POST_LIKES + 1 WHERE POST_IDX = ?`, [postId]);
      return res.json({ liked: true });
    }
  } catch (err) {
    console.error("게시글 좋아요 토글 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});


module.exports = router;
