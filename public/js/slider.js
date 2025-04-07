document.addEventListener('DOMContentLoaded', () => {
    const slideTrack = document.querySelector('.slide-track');
    let currentIndex = 0; // 첫 번째 이미지부터 시작 (인덱스는 0부터 시작)

    // 서버에서 슬라이드 데이터 로드
    fetch('http://localhost:8081/test1/SlideDataServlet')
        .then(response => response.json())
        .then(data => {
            slideTrack.innerHTML = ''; // 기존 슬라이드 초기화

            // 슬라이드 데이터 동적 생성
            data.forEach(item => {
                const slideItem = document.createElement('a');
                slideItem.href = `detail.html?musicalId=${item.musicalId}&showIdx=${item.showIdx}`;
                slideItem.classList.add('slide-item');

                const img = document.createElement('img');
                img.src = item.musicalPoster;
                img.alt = item.musicalTitle;
                slideItem.appendChild(img);

                slideTrack.appendChild(slideItem);
            });

            // 데이터 로드 후 슬라이드 초기화
            updateSlidePosition();
            setInterval(nextSlide, 3000); // 3초마다 다음 슬라이드로 이동
        })
        .catch(error => console.error('Error loading slide data:', error));

		function updateSlidePosition() {
		    const slides = Array.from(slideTrack.children); // 슬라이드 목록
		    const slideCount = slides.length;
		    if (slideCount === 0) return;

		    // 모든 슬라이드 초기화
		    slides.forEach(slide => {
		        slide.classList.remove('active', 'left', 'right', 'hidden');
		    });

		    // 현재 슬라이드 강조
		    slides[currentIndex].classList.add('active');

		    // 왼쪽 및 오른쪽 슬라이드 강조
		    const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
		    const nextIndex = (currentIndex + 1) % slideCount;
		    slides[prevIndex].classList.add('left');
		    slides[nextIndex].classList.add('right');

		    // 나머지 슬라이드 숨김 처리
		    slides.forEach((slide, index) => {
		        if (index !== currentIndex && index !== prevIndex && index !== nextIndex) {
		            slide.classList.add('hidden');
		        }
		    });
		}

		function nextSlide() {
		    const slideCount = slideTrack.children.length;

		    currentIndex++;
		    if (currentIndex >= slideCount) {
		        currentIndex = 0; // 첫 번째 슬라이드로 루프
		    }
		    updateSlidePosition();
		}

});
