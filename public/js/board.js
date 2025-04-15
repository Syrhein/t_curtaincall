document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/posts") // 게시글 목록 API 호출
      .then(response => response.json())
      .then(posts => {
        const tbody = document.getElementById("postTableBody");
        tbody.innerHTML = "";
  
        posts.forEach((post, index) => {
          const row = document.createElement("tr");
  
          row.innerHTML = `
          <td>${posts.length - index}</td>
          <td><a href="BoardDetail.html?postIdx=${post.postIdx}" class="board-title">${post.postTitle}</a></td>
          <td>${post.userName || post.userId}</td>
          <td>${new Date(post.createdAt).toLocaleDateString()}</td>
          <td style="text-align:center">${post.postViews}</td>
          <td style="text-align:center">${post.postLikes || 0}</td>
        `;
        
  
          tbody.appendChild(row);
        });
      })
      .catch(err => {
        console.error("게시글 목록 불러오기 실패:", err);
        const tbody = document.getElementById("postTableBody");
        tbody.innerHTML = `<tr><td colspan="5">게시글을 불러오는 중 오류가 발생했습니다.</td></tr>`;
      });
  });
  