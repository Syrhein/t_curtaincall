document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    if (!calendarEl) {
        console.error('캘린더 DOM 요소를 찾을 수 없습니다.');
        return;
    }

    try {
        // FullCalendar 초기화
        const calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: ['dayGrid'], // 월별 보기 플러그인
            initialView: 'dayGridMonth', // 기본 월간 보기 설정
            events: (fetchInfo, successCallback, failureCallback) => {
                fetch('http://localhost:8081/test1/CalendarServlet')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json(); // JSON 데이터 파싱
                    })
                    .then(events => {
                        // 성공적으로 데이터를 가져온 경우 이벤트 렌더링
                        successCallback(events);
                    })
                    .catch(error => {
                        console.error('캘린더 이벤트 데이터를 가져오는 데 실패했습니다:', error);
                        failureCallback(error);
                    });
            },
            eventRender: function (info) {
                // 기존의 제목 span을 링크로 교체
                const link = document.createElement('a'); // 링크 요소 생성
                link.textContent = info.event.title; // 제목 설정
                link.href = `http://localhost:8081/test1/detail.html?musicalId=${info.event.extendedProps.musicalId}&showIdx=${info.event.extendedProps.showIdx}`; // 상세페이지 URL 설정
                link.target = '_blank'; // 새 창에서 열기
                link.className = 'fc-title-link'; // CSS 클래스 추가

                // 기존 span.fc-title을 link로 교체
                const titleElement = info.el.querySelector('.fc-title'); // 기존 제목 요소
                if (titleElement) {
                    titleElement.innerHTML = ''; // 기존 텍스트 제거
                    titleElement.appendChild(link); // 링크 추가
                }
            },
        });

        // 캘린더 렌더링
        calendar.render();
    } catch (error) {
        console.error('캘린더 초기화 중 오류가 발생했습니다:', error);
    }
});
