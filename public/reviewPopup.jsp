<%@page import="smhrd.model.ReviewVO"%>
<%@page import="java.util.List"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="./css/favoritePopup.css">
<html>
<head>
    <title>내 리뷰 목록</title>
</head>
<body>
    <h1>내가 작성한 리뷰</h1>
    <table border="1">
        <thead>
            <tr>
                <th>뮤지컬 제목</th>
                <th>리뷰 내용</th>
                <th>작성 날짜</th>
            </tr>
        </thead>
        <tbody>
        <% 
            List<ReviewVO> reviewList = (List<ReviewVO>) request.getAttribute("reviewList");
            if (reviewList != null && !reviewList.isEmpty()) {
                for (ReviewVO review : reviewList) {
        %>
            <tr>
                <td><%= review.getMusicalTitle() %></td>
                <td><%= review.getReviewContent() %></td>
                <td><%= review.getCreatedAt() %></td>
            </tr>
        <% 
                }
            } else {
        %>
            <tr>
                <td colspan="3">작성된 리뷰가 없습니다.</td>
            </tr>
        <% } %>
        </tbody>
    </table>
</body>
</html>
