# 🎭 Curtain Call Guide
> 막이 오르기 전, 알아두면 좋은 뮤지컬 정보 플랫폼

---

🧭 프로젝트 소개

**Curtain Call Guide**는 뮤지컬을 처음 접하는 입문자부터 열성 팬까지
누구나 쉽게 공연 정보를 탐색하고, 개인의 관람 기록을 관리하며,
팬덤과 함께 소통할 수 있도록 설계된 **뮤지컬 종합 정보 플랫폼**입니다.

또한 KOPIS(공연예술통합전산망) OpenAPI를 활용하여  
뮤지컬 공연정보를 수집하고, 데이터베이스에 저장 및 관리하는 시스템입니다.  
공연 기본정보와 회차정보를 정제하여 중복 없이 관리할 수 있도록 설계하였으며,  
**공연 일정 기반 캘린더 표시**, **상세페이지 뷰 제공**, **공연 즐겨찾기 기능** 등  
다양한 서비스와 연계할 수 있도록 확장성 높은 구조를 갖추었습니다.

---

💡 핵심 기능

🔍 뮤지컬 정보 검색 및 제공
- 공연 제목, 배우명 기반 검색(향후 구현 목표)
- 공연 일정, 출연 배우(api 한계상 일부 미흡), 시놉시스(미구현) 등 상세 정보 제공

🎭 공연정보 수집 및 저장
- KOPIS OpenAPI를 이용하여 **공연목록 + 상세정보**를 통합 수집
- CLI 인자 기반 기간 설정 지원 (예: `20250401 ~ 20250531`)

🎯 데이터베이스 정제 및 중복 방지
- **musicalId** 기준으로 공연 기본정보(TB_MUSICAL) 중복 저장 방지
- 공연 회차정보(TB_SHOW)도 musicalId 기준 관리
- 중복된 공연이 다시 등록되는 것을 원천 차단

🗓️ 공연 캘린더 연동
- 관심 등록된 공연을 **FullCalendar.js** 기반 캘린더에 시각화
- 공연 일정 클릭 시 상세페이지로 이동 지원

🧩 통합 관리 구조
- 공연 기본정보(TB_MUSICAL)와 공연 일정정보(TB_SHOW) 분리 관리
- 공연별 관심 등록(TB_FAVORITE) 기능

---

🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| Backend | Node.js, Express |
| Database | MySQL |
| Data Collection | Axios, xml2js |
| API 사용 | KOPIS OpenAPI |
| 기타 | dotenv (환경변수 관리) |

---

🔗 주요 화면 및 기능 구성

- 공연 메인 목록 조회
- 공연 상세페이지 조회
- 공연 즐겨찾기 추가/삭제
- 자유 게시판, 게시판 내 댓글, 댓글간 답글 및 좋아요 기능
- 마이페이지 → 즐겨찾기/작성글/작성리뷰 조회
- 마이페이지 → 관심 등록 공연 캘린더 표시

---

🗃️ DB 테이블 구성

- `tb_user`: 사용자 정보
- `tb_musical`: 공연 기본정보
- `tb_show`: 공연 회차(상영일자, 장소 등)
- `tb_favorite`: 사용자 즐겨찾기 등록정보
- `tb_review`: 사용자 공연 리뷰
- `tb_post`: 사용자 게시글 (게시판)
- `tb_comment`: 게시글 댓글
- `tb_post_likes`: 게시글 좋아요 기록
- `tb_comment_likes`: 댓글 좋아요 기록

---

🚀 주요 성과

- CLI 인자 기반 수집 범위 설정으로 유연한 데이터 수집 가능
- musicalId 기준으로 공연 정보 중복 저장 방지
- TB_SHOW 회차 데이터까지 분리 저장 → 세밀한 공연 일정 관리 가능
- 검색 필터링 및 페이징 처리로 UX 개선
- 갤러리형 공연 정보 레이아웃 구현으로 정보 접근성 강화

---

🔮 향후 확장 방향

- 공연별 출연진 세부정보 저장 및 관리
- 공연 관람 후기(리뷰) 작성/관리 기능 확장
- 스케줄러(node-cron) 기반 정기적 데이터 수집 자동화
- 관리자용 공연 등록/삭제/수정 페이지 구축
- 회원 리뷰 기반 추천 알고리즘 고도화
- 소개 영상 연동
- 추가적인 정보 SNS 크롤링 하여 더 많은 자료 활용

---


🛠 시스템 아키텍처

사용자 요청 (콘솔에 node fetch/kopisFetcher.js 20250401 20250531) 기한은 본인이 지정하고 싶은 기한으로

↓ 

Express 서버 (Node.js) 

↓ 

MySQL 데이터베이스 (공연정보 / 회차정보 저장)

↓ 

KOPIS OpenAPI (공연데이터 수집)

↓ 

Express 서버 (Node.js) [콘솔 node index.js로 실행]

↓ 

localhost로 실행


---

🗃️ DB 테이블 생성 쿼리


CREATE TABLE `tb_user` (
   `USER_ID` varchar(50) NOT NULL,
   `USER_PW` varchar(50) NOT NULL,
   `USER_NAME` varchar(50) NOT NULL,
   `USER_EMAIL` varchar(50) NOT NULL,
   `USER_TEL` varchar(50) NOT NULL,
   `JOINED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `USER_IMG` varchar(1000) DEFAULT NULL,
   PRIMARY KEY (`USER_ID`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


 CREATE TABLE `tb_show` (
   `SHOW_IDX` int NOT NULL AUTO_INCREMENT,
   `MUSICAL_ID` varchar(200) NOT NULL,
   `HALL_NAME` varchar(1000) NOT NULL,
   `SHOW_DT` varchar(1000) NOT NULL,
   `SHOW_RUNTIME` varchar(500) NOT NULL,
   `SHOW_PRICE` varchar(500) NOT NULL DEFAULT '0',
   `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `SHOW_IMGS` text NOT NULL,
   `SHOW_VIEWS` int DEFAULT '0',
   `SHOW_CAST` text,
   PRIMARY KEY (`SHOW_IDX`),
   KEY `MUSICAL_ID` (`MUSICAL_ID`),
   CONSTRAINT `tb_show_ibfk_1` FOREIGN KEY (`MUSICAL_ID`) REFERENCES `tb_musical` (`MUSICAL_ID`) ON DELETE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `tb_review` (
   `REVIEW_IDX` int NOT NULL AUTO_INCREMENT,
   `SHOW_IDX` int NOT NULL,
   `USER_ID` varchar(50) NOT NULL,
   `REVIEW_CONTENT` text NOT NULL,
   `REVIEW_STAR` int NOT NULL,
   `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `REVIEW_LIKES` int DEFAULT '0',
   PRIMARY KEY (`REVIEW_IDX`),
   KEY `SHOW_IDX` (`SHOW_IDX`),
   KEY `USER_ID` (`USER_ID`),
   CONSTRAINT `tb_review_ibfk_1` FOREIGN KEY (`SHOW_IDX`) REFERENCES `tb_show` (`SHOW_IDX`) ON DELETE CASCADE,
   CONSTRAINT `tb_review_ibfk_2` FOREIGN KEY (`USER_ID`) REFERENCES `tb_user` (`USER_ID`) ON DELETE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


 CREATE TABLE `tb_post_likes` (
   `POST_IDX` int NOT NULL,
   `USER_ID` varchar(50) NOT NULL,
   PRIMARY KEY (`POST_IDX`,`USER_ID`),
   KEY `USER_ID` (`USER_ID`),
   CONSTRAINT `tb_post_likes_ibfk_1` FOREIGN KEY (`POST_IDX`) REFERENCES `tb_post` (`POST_IDX`) ON DELETE CASCADE,
   CONSTRAINT `tb_post_likes_ibfk_2` FOREIGN KEY (`USER_ID`) REFERENCES `tb_user` (`USER_ID`) ON DELETE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


 CREATE TABLE `tb_post` (
   `POST_IDX` int NOT NULL AUTO_INCREMENT,
   `POST_TITLE` varchar(1000) NOT NULL,
   `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `POST_VIEWS` int NOT NULL DEFAULT '0',
   `POST_LIKES` int NOT NULL DEFAULT '0',
   `USER_ID` varchar(50) NOT NULL,
   `POST_FILE_NAME` varchar(1000) DEFAULT NULL,
   `POST_FILE_PATH` varchar(1000) DEFAULT NULL,
   `POST_CONTENT` text,
   `USER_NAME` varchar(50) DEFAULT NULL,
   PRIMARY KEY (`POST_IDX`),
   KEY `USER_ID` (`USER_ID`),
   CONSTRAINT `tb_post_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `tb_user` (`USER_ID`) ON DELETE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

 

CREATE TABLE `tb_musical` (
   `MUSICAL_ID` varchar(200) NOT NULL,
   `MUSICAL_TITLE` varchar(200) NOT NULL,
   `MUSICAL_POSTER` varchar(1000) NOT NULL,
   `MUSICAL_ST_DT` date NOT NULL,
   `MUSICAL_ED_DT` date NOT NULL,
   `MUSICAL_LICENSE` varchar(50) NOT NULL,
   `MUSICAL_CREATE` varchar(50) NOT NULL,
   `MUSICAL_CAST` text,
   PRIMARY KEY (`MUSICAL_ID`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


 CREATE TABLE `tb_favorite` (
   `FAV_IDX` int NOT NULL AUTO_INCREMENT,
   `USER_ID` varchar(50) NOT NULL,
   `SHOW_IDX` int NOT NULL,
   `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`FAV_IDX`),
   KEY `USER_ID` (`USER_ID`),
   KEY `SHOW_IDX` (`SHOW_IDX`),
   CONSTRAINT `tb_favorite_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `tb_user` (`USER_ID`) ON DELETE CASCADE,
   CONSTRAINT `tb_favorite_ibfk_2` FOREIGN KEY (`SHOW_IDX`) REFERENCES `tb_show` (`SHOW_IDX`) ON DELETE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `tb_comment_likes` (
   `CMT_IDX` int NOT NULL,
   `USER_ID` varchar(50) NOT NULL,
   PRIMARY KEY (`CMT_IDX`,`USER_ID`),
   KEY `USER_ID` (`USER_ID`),
   CONSTRAINT `tb_comment_likes_ibfk_1` FOREIGN KEY (`CMT_IDX`) REFERENCES `tb_comment` (`CMT_IDX`) ON DELETE CASCADE,
   CONSTRAINT `tb_comment_likes_ibfk_2` FOREIGN KEY (`USER_ID`) REFERENCES `tb_user` (`USER_ID`) ON DELETE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
 


CREATE TABLE `tb_comment` (
   `CMT_IDX` int NOT NULL AUTO_INCREMENT,
   `POST_IDX` int NOT NULL,
   `CMT_CONTENT` text NOT NULL,
   `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `CMT_LIKES` int NOT NULL DEFAULT '0',
   `USER_ID` varchar(50) NOT NULL,
   `PARENT_IDX` int DEFAULT NULL,
   PRIMARY KEY (`CMT_IDX`),
   KEY `POST_IDX` (`POST_IDX`),
   KEY `USER_ID` (`USER_ID`),
   CONSTRAINT `tb_comment_ibfk_1` FOREIGN KEY (`POST_IDX`) REFERENCES `tb_post` (`POST_IDX`) ON DELETE CASCADE,
   CONSTRAINT `tb_comment_ibfk_2` FOREIGN KEY (`USER_ID`) REFERENCES `tb_user` (`USER_ID`) ON DELETE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

---






---

📎 참고자료

- KOPIS 공연 정보 API (https://www.kopis.or.kr/por/main/main.do)

---

---



