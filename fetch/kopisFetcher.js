
const axios = require('axios');
const xml2js = require('xml2js');

require('dotenv').config(); // .env 파일의 내용을 읽어와서 process.env에 등록함

const SERVICE_KEY = process.env.SERVICE_KEY; // 안전하게 키를 불러옴

const BASE_URL = 'http://kopis.or.kr/openApi/restful/pblprfr';
const std= '20250401';
const edd= '20250430';



// 데이터 가져오기
async function fetchMusicalList(page = 1, rows = 10) {
    const url = `${BASE_URL}?service=${SERVICE_KEY}&stdate=${std}&eddate=${edd}&cpage=${page}&rows=${rows}&shcate=GGGA`;
    
    try{
        const response = await axios.get(url);
        const parser = new xml2js.Parser({ explicitArray: false});
        const result = await parser.parseStringPromise(response.data);

        const musicals = result.dbs?.db;
        if (!musicals) {
            console.log('더 이상 데이터 없음')
            return [];
        }
        
        const cleanList = Array.isArray(musicals) ? musicals : [musicals];
        const extracted = cleanList.map(item => ({
            mt20id : item.mt20id,
            prfnm : item.prfnm,
            poster : item.poster,
            prfpdfrom : item.prfpdfrom,
            prfpdto : item.prfpdto
        }));

        console.log(`page ${page} 공연 ${extracted.length}개 수집`);
        return extracted;

    }catch (err) {
        console.log(`목록 API 호출 실패 (page ${page})`, err.message);
        return [];
    }
}

// 테스트 실행
(async () => {
    const musicals = await fetchMusicalList(1, 10);
    console.log(musicals);
})();




