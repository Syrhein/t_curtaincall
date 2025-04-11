document.addEventListener('DOMContentLoaded', () => {
    const btnSignUp = document.querySelector('.BtnSignUp');
    const btnLogin = document.querySelector('.BtnLogin');
    const btnLogout = document.querySelector('.BtnLogout');
    const iconMy = document.querySelector('.icon_my');

    // 로그인 상태 확인 함수
    const checkLoginStatus = () => {
        return fetch('/api/login/status') // ✅ 절대 경로로 변경
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });
    };

    // 로그인 상태 처리 함수
    const updateUI = ({ loggedIn, error }) => { // ✅ 'isLoggedIn' → 'loggedIn'
        if (loggedIn) {
            if (btnSignUp) btnSignUp.style.display = 'none';
            if (btnLogin) btnLogin.style.display = 'none';
            if (btnLogout) btnLogout.style.display = 'block';
        } else {
            if (btnSignUp) btnSignUp.style.display = 'block';
            if (btnLogin) btnLogin.style.display = 'block';
            if (btnLogout) btnLogout.style.display = 'none';
        }

        if (iconMy) {
            iconMy.onclick = () => {
                if (!loggedIn) {
                    alert(error || '로그인이 필요합니다!');
                    window.location.href = 'login.html';
                } else {
                    window.location.href = 'MyPage.html';
                }
            };
        }
    };

    // 로그아웃 처리
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            fetch('/api/login/logout')
                .then(response => {
                    if (response.ok) {
                        alert('로그아웃 되었습니다.');
                        window.location.href = 'Main.html';
                    } else {
                        alert('로그아웃에 실패했습니다.');
                    }
                })
                .catch(error => {
                    console.error('Error during logout:', error);
                    alert('네트워크 오류가 발생했습니다.');
                });
        });
    }

    // 로그인 상태 확인 & UI 초기화
    checkLoginStatus()
        .then(data => updateUI(data)) // ✅ loggedIn 기반으로 UI 적용
        .catch(error => {
            console.error('Error checking login status:', error);
            alert('네트워크 오류가 발생했습니다.');
            updateUI({ loggedIn: false, error: '네트워크 오류' });
        });
});
