
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

// 상세 공연 정보 가져오기
async function fetchMusicalDetail(mt20id) {
    const url = `http://kopis.or.kr/openApi/restful/pblprfr/${mt20id}?service=${SERVICE_KEY}`;
  
    try {
      const response = await axios.get(url);
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(response.data);
  
      const detail = result.dbs?.db;
      if (!detail) {
        console.warn(`⚠️ ${mt20id} 상세 정보 없음`);
        return null;
      }
  
      const prfcast = detail.prfcast?.trim();
      if (!prfcast || prfcast === 'N/A') {
        console.log(`🚫 출연진 없음 → ${mt20id} 제외`);
        return null;
      }
  
      // 포스터 이미지 여러 개 처리 (styurls → styurl[])
      let styurls = '없음';
      if (detail.styurls?.styurl) {
        const urls = Array.isArray(detail.styurls.styurl)
          ? detail.styurls.styurl
          : [detail.styurls.styurl];
        styurls = urls.filter(Boolean).join('; ');
      }
  
      // 반환할 공연 상세 객체 구성
      return {
        mt20id,
        prfnm: detail.prfnm,
        poster: detail.poster,
        prfpdfrom: detail.prfpdfrom,
        prfpdto: detail.prfpdto,
        prfcast,
        fcltynm: detail.fcltynm || 'N/A',
        dtguidance: detail.dtguidance || 'N/A',
        prfruntime: detail.prfruntime || 'N/A',
        pcseguidance: detail.pcseguidance || 'N/A',
        styurls,
        musicallicense: detail.musicallicense || 'N/A',
        musicalcreate: detail.musicalcreate || 'N/A',
      };
    } catch (err) {
      console.error(`❌ 상세 API 실패 (${mt20id}):`, err.message);
      return null;
    }
  }
  

(async () => {
    const musicalList = await fetchMusicalList(1, 10); // 10개 기준
  
    const result = [];
    for (const item of musicalList) {
      const detail = await fetchMusicalDetail(item.mt20id);
      if (detail) result.push(detail);
    }
  
    console.log(`🎉 최종 수집 공연 수: ${result.length}`);
    console.dir(result, { depth: null });
  })();
  

