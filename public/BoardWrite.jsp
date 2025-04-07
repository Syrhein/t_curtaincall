<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>글쓰기</title>
    <link rel="stylesheet" href="./css/BoardWrite.css">
</head>
<body>

    <!-- 헤더 영역 -->
    <div class="header">
        <div class="Frame1">
            <div class="categories">
                <div class="category"><a href="cate_create.html">국내창작</a></div>
                <div class="category"><a href="cate_license.html">라이센스</a></div>
                <div class="category"><a href="Board.jsp">게시판</a></div>
            </div>
            <div class="logo"><a href="Main.html">CURTAIN CALL GUIDE</a></div>
            <div class="Buttons">
                <div class="BtnSignUp"><a href="signUp.html" class="SignUp">회원가입</a></div>
                <div class="BtnLogin"><a href="login.html" class="Login">로그인</a></div>
                <div data-layer="btn_logout" class="BtnLogout" style="display: none;"><div class="Logout">로그아웃</div></div>
                <a href="MyPage.jsp"><img src="./img/icon_my.png" class="icon_my" alt="My Icon"></a>
            </div>
        </div>
    </div>

    <!-- 게시판 글쓰기 영역 -->
    <div class="container">
        <div class="card">
            <div class="card-header1">
                <!-- 게시판으로 돌아가는 링크 -->
                <h1><a href="Board.jsp">게시판</a></h1>
            </div>

            <div class="card-write">
                <form action="BoardWriteCon" method="post" enctype="multipart/form-data">
                    <div class="title-w">
                        제목<input type="text" name="postTitle" placeholder="제목을 입력하세요." required>
                    </div>

                    <div class="msg">
                        <!-- 내용을 입력하기 위해 textarea 태그 사용 -->
                        내용<textarea name="postContent" placeholder="내용을 입력하세요." rows="10" required></textarea>
                    </div>

                    <input type="file" name="postFile" id="">

                    <!-- 작성 버튼 -->
                    <div class="btn-w">
                        <button type="submit">작성</button>
                        <a href="Board.jsp">취소</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

<script src="./js/common.js"></script>
</body>
</html>
