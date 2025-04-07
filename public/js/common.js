document.addEventListener('DOMContentLoaded', () => {
    const btnSignUp = document.querySelector('.BtnSignUp');
    const btnLogin = document.querySelector('.BtnLogin');
    const btnLogout = document.querySelector('.BtnLogout');
    const iconMy = document.querySelector('.icon_my');

    // 로그인 상태 확인 함수
    const checkLoginStatus = () => {
        return fetch('http://localhost:8081/test1/CheckLoginCon')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
    };

    // 로그인 상태 처리 함수
    const updateUI = ({ isLoggedIn, error }) => {
        if (isLoggedIn) {
            if (btnSignUp) btnSignUp.style.display = 'none';
            if (btnLogin) btnLogin.style.display = 'none';
            if (btnLogout) btnLogout.style.display = 'block'; // 로그아웃 버튼 표시
        } else {
            if (btnSignUp) btnSignUp.style.display = 'block';
            if (btnLogin) btnLogin.style.display = 'block';
            if (btnLogout) btnLogout.style.display = 'none'; // 로그아웃 버튼 숨기기
        }

        if (iconMy) {
            iconMy.onclick = () => {
                if (!isLoggedIn) {
                    alert(error || '로그인이 필요합니다!');
                    window.location.href = 'login.html';
                } else {
                    window.location.href = 'MyPage.html';
                }
            };
        }
    };

    // 로그아웃 버튼 클릭 이벤트
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            fetch('http://localhost:8081/test1/LogoutCon', { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        alert('로그아웃 되었습니다.');
                        window.location.href = 'Main.html'; // 메인 페이지로 리다이렉트
                    } else {
                        alert('로그아웃에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('Error during logout:', error);
                    alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                });
        });
    }

    // 로그인 상태 확인 및 UI 초기화
    checkLoginStatus()
        .then(data => updateUI(data))
        .catch(error => {
            console.error('Error checking login status:', error);
            alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            updateUI({ isLoggedIn: false, error: '네트워크 오류' });
        });
});
