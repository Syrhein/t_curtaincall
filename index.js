const express = require('express'); // 서버 만드는 라이브러리
const session = require('express-session');
const path = require('path');
const app = express(); // 서버 인스턴스를 app에 담기
const PORT = 3000; // 포트 설정 http://localhost:3000

// 정적 파일 경로
app.use(express.static(path.join(__dirname, 'public'))); 

// request에 담긴 json을 읽게 해주는 미들웨어
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // 폼 전송도 가능하게

// ✅ 세션 설정 (추가!)
app.use(session({
  secret: 'curtaincall-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1시간
}));

// API 라우터 연결
const slideRoutes = require('./routes/slides');
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const musicalRoutes = require('./routes/musicals');
const favoriteRoutes = require('./routes/favorite');
const reviewRoutes = require('./routes/reviews');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
app.use('/api/slides', slideRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/musicals', musicalRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


// 기본 경로
app.get('/', (req, res) => { // 루트 경로 / 에 접속시 보내줄 응답
  res.sendFile(path.join(__dirname, 'public', 'Main.html'));
});

app.listen(PORT, () => { // 서버 실행 부분
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
