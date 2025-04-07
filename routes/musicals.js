// routes/musicals.js
// 새 라우터를 만든다(작은 서버?) 
const express = require('express');
const router = express.Router();
const db = require('../db');


// api/musicals로 요청시 처리할 내용
router.get('/', async (req, res) => {
  try{
    const [rows] = await db.query('SELECT * FROM musicals');
    res.json(rows);
  }catch (err) {
    console.error(err);
    res.status(500).json({ message : '서버 에러'});
  } 
});

// router를 내보내는 코드
module.exports = router;
