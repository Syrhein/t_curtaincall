<%@page import="smhrd.model.BoardVO"%>
<%@page import="java.util.List"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="./css/favoritePopup.css">
<html>
<head>
    <title>게시글 목록</title>
</head>
<body>
    <h1>내 게시글 목록</h1>
    <table border="1">
        <thead>
            <tr>
                <th>게시글 제목</th>
                <th>작성 날짜</th>
            </tr>
        </thead>
        <tbody>
        <%
            // 전달받은 게시글 목록 데이터
            List<BoardVO> postList = (List<BoardVO>) request.getAttribute("postList");
            if (postList != null && !postList.isEmpty()) {
                for (BoardVO post : postList) {
        %>
            <tr>
                <td>
                    <!-- 게시글 제목에 클릭 가능한 링크 추가 -->
                    <a href="http://localhost:8081/test1/BoardDetailCon?postIdx=<%= post.getPostIdx() %>" target="_blank">
                        <%= post.getPostTitle() %>
                    </a>
                </td>
                <td><%= post.getCreatedAt() %></td>
            </tr>
        <%
                }
            } else {
        %>
            <tr>
                <td colspan="2">작성된 게시글이 없습니다.</td>
            </tr>
        <%
            }
        %>
        </tbody>
    </table>
</body>
</html>
