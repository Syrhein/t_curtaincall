<%@page import="smhrd.model.MyPageVO"%>
<%@page import="java.util.List"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="./css/favoritePopup.css">
<html>
<head>
    <title>관심 등록 목록</title>
</head>
<body>
    <h1>내 관심 등록 목록</h1>
    <table border="1">
        <thead>
            <tr>
                <th>뮤지컬 제목</th>
                <th>등록 날짜</th>
            </tr>
        </thead>
        <tbody>
        <%
            List<MyPageVO> favoriteList = (List<MyPageVO>) request.getAttribute("favoriteList");
            if (favoriteList != null && !favoriteList.isEmpty()) {
                for (MyPageVO favorite : favoriteList) {
        %>
            <tr>
                <td>
                    <a href="http://localhost:8081/test1/detail.html?musicalId=<%= favorite.getMusicalId() %>&showIdx=<%= favorite.getShowIdx() %>" target="_blank">
                        <%= favorite.getMusicalTitle() %>
                    </a>
                </td>
                <td><%= favorite.getCreatedAt() %></td>
            </tr>
        <%
                }
            } else {
        %>
            <tr>
                <td colspan="2">관심 등록된 뮤지컬이 없습니다.</td>
            </tr>
        <%
            }
        %>
        </tbody>
    </table>
</body>
</html>
