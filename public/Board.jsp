<%@page import="smhrd.model.BoardVO"%>
<%@page import="java.util.List"%>
<%@page import="smhrd.model.BoardDAO"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게시판</title>
    <link rel="stylesheet" href="./css/Board.css">
    <script src="./js/navigation.js"></script>
</head>
<body>
    <!-- 헤더 영역 -->
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

    <!-- 게시판 영역 -->
    <div class="container">
        <h1>게시판</h1>

        <div class="btn_posting">
            <input type="button" onclick="location.href='BoardWrite.jsp'" value="글쓰기 ✏️" class="btn_list">
        </div>

        <table class="board_list">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                </tr>
            </thead>
            <tbody>
                <%
                    BoardDAO dao = new BoardDAO();
                    int currentPage = 1;
                    int itemsPerPage = 10;
                    if (request.getParameter("page") != null) {
                        currentPage = Integer.parseInt(request.getParameter("page"));
                    }

                    int startIndex = (currentPage - 1) * itemsPerPage;
                    List<BoardVO> boardList = dao.getBoardList();
                    int totalItems = boardList.size();
                    int totalPages = (int) Math.ceil((double) totalItems / itemsPerPage);

                    List<BoardVO> paginatedList = boardList.subList(
                        startIndex, Math.min(startIndex + itemsPerPage, totalItems)
                    );
                    request.setAttribute("paginatedList", paginatedList);
                    request.setAttribute("totalPages", totalPages);
                %>
                <c:forEach var="board" items="${paginatedList}">
                    <tr>
                        <td>${board.postIdx}</td>
                        <td><a href="BoardDetailCon?postIdx=${board.postIdx}">${board.postTitle}</a></td>
                        <td>${board.userId}</td>
                        <td>${board.createdAt}</td>
                        <td>${board.postViews}</td>
                        <td>${board.postLikes}</td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <!-- 페이지 번호 영역 -->
        <div class="paginate_area">
            <div class="ArticlePaginate">
                <c:forEach var="i" begin="1" end="${totalPages}">
                    <a href="Board.jsp?page=${i}" class="btn number">${i}</a>
                </c:forEach>
            </div>
        </div>
    </div>
    
    <script src="./js/common.js"></script>
</body>
</html>
