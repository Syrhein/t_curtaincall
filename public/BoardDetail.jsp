<%@page import="smhrd.model.CommentVO"%>
<%@page import="smhrd.model.BoardDAO"%>
<%@page import="smhrd.model.BoardVO"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>게시글 보기</title>
<link rel="stylesheet" href="./css/BoardDetail.css">
<script src="./js/navigation.js"></script>
</head>
<body>
	<div class="header">
		<div class="Frame1">
			<div class="categories">
				<div class="category">국내창작</div>
				<div class="category">라이센스</div>
				<div class="category">게시판</div>
			</div>
			<div class="logo">CURTAIN CALL GUIDE</div>
			<div class="Buttons">
				<div class="BtnSignUp">
					<div class="SignUp">회원가입</div>
				</div>
				<div class="BtnLogin">
					<div class="Login">로그인</div>
				</div>
				<div data-layer="btn_logout" class="BtnLogout"
					style="display: none;">
					<div class="Logout">로그아웃</div>
				</div>
				<img src="./img/icon_my.png" class="icon_my" alt="My Icon">
			</div>
		</div>
	</div>

	<div class="container">
		<div class="card">
			<%
			int postIdx = Integer.parseInt(request.getParameter("postIdx"));
			BoardDAO dao = new BoardDAO();
			BoardVO board = dao.getBoardDetail(postIdx);
			%>

			<div class="card-view">
				<div class="title">
					<h2><%=board.getPostTitle()%></h2>
				</div>
				<div class="myinfo">
					<dl>
						<dt>작성자</dt>
						<dd><%=board.getUserId()%></dd>
					</dl>
					<dl>
						<dt>날짜</dt>
						<dd><%=board.getCreatedAt()%></dd>
					</dl>
					<dl>
						<dt>조회</dt>
						<dd><%=board.getPostViews()%>회</dd>
					</dl>
					<dl>
						<dt>좋아요</dt>
						<dd id="like-count-<%=board.getPostIdx()%>"><%=board.getPostLikes()%></dd>
					</dl>
				</div>
				<button onclick="likePost(<%=board.getPostIdx()%>)">좋아요</button>
			</div>

			<div class="cont">
				<%
				if (board.getPostFileName() != null && !board.getPostFileName().isEmpty()) {
				%>
				<img src="<%=board.getPostFilePath()%>" class="cont_img">
				<%
				}
				%>
				<div class="cont_text">
					<p><%=board.getPostContent().replaceAll("\n", "<br>")%></p>
				</div>
			</div>

			<div class="comment">
				<h3>댓글</h3>
				<%
				List<CommentVO> comments = dao.getComments(postIdx);
				for (CommentVO comment : comments) {
				%>
				<div class="comment_area">
					<div class="comment_info">
						<h3 class="comment_nick"><%=comment.getUserId()%></h3>
					</div>
					<div class="comment_content">
						<p class="comment_text"><%=comment.getCmtContent()%></p>
					</div>
					<div class="comment_tmdt">
						<span class="datetime"><%=comment.getCreatedAt()%></span>
					</div>
				</div>
				<%
				}
				%>
			</div>

			<div class="reacting_area">
				<form action="AddCommentCon" method="post">
					<input type="hidden" name="postIdx" value="<%=postIdx%>">
					<input type="text" class="post_reacting" name="cmtContent"
						placeholder="✏️ 댓글에 참여하세요">
					<button type="submit">등록</button>
				</form>
			</div>
		</div>
	</div>

	<script>
    async function likePost(postIdx) {
        try {
            const response = await fetch('LikePostCon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `postIdx=${postIdx}`
            });

            if (response.ok) {
                const result = await response.json();
                document.getElementById(`like-count-${postIdx}`).textContent = result.likes;
            } else {
                console.error('좋아요 처리 실패');
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    }
	</script>
	
	<script src="./js/common.js"></script>
</body>
</html>
