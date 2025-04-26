
const axios = require('axios');
const xml2js = require('xml2js');

const { saveAllToDB } = require('./saveToDB');
require('dotenv').config(); // .env 파일의 내용을 읽어와서 process.env에 등록함

// CLI 파라미터 읽기
const args = process.argv.slice(2);

const SERVICE_KEY = process.env.SERVICE_KEY; // 안전하게 키를 불러옴
const BASE_URL = 'http://kopis.or.kr/openApi/restful/pblprfr';

// 날짜 기본값은 20250401 ~ 20250430
const std = args[0] || '20250401';
const edd = args[1] || '20250430';

console.log(`📅 데이터 수집 기간: ${std} ~ ${edd}`);



// 목록 API 호출
async function fetchMusicalList(page = 1, rows = 10) {
    const url = `${BASE_URL}?service=${SERVICE_KEY}&stdate=${std}&eddate=${edd}&cpage=${page}&rows=${rows}&shcate=GGGA`;
  
    try {
      const response = await axios.get(url);
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(response.data);
  
      const musicals = result.dbs?.db;
      if (!musicals) {
        console.log('📭 더 이상 데이터 없음');
        return [];
      }
  
      const cleanList = Array.isArray(musicals) ? musicals : [musicals];
      const extracted = cleanList.map(item => ({
        mt20id: item.mt20id,
        prfnm: item.prfnm,
        poster: item.poster,
        prfpdfrom: item.prfpdfrom,
        prfpdto: item.prfpdto
      }));
  
      console.log(`📄 page ${page} → ${extracted.length}개 공연`);
      return extracted;
  
    } catch (err) {
      console.log(`❌ 목록 API 실패 (page ${page})`, err.message);
      return [];
    }
  }
  
  // 상세 API 호출
  async function fetchMusicalDetail(mt20id) {
    const url = `http://kopis.or.kr/openApi/restful/pblprfr/${mt20id}?service=${SERVICE_KEY}`;
  
    try {
      const response = await axios.get(url);
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(response.data);
  
      const detail = result.dbs?.db;
      if (!detail) {
        console.warn(`⚠️ ${mt20id} 상세 없음`);
        return null;
      }
  
      const prfcast = detail.prfcast?.trim();
      if (!prfcast || prfcast === 'N/A') {
        console.log(`🚫 출연진 없음 → ${mt20id}`);
        return null;
      }
  
      // 포스터 이미지 처리
      let styurls = '없음';
      if (detail.styurls?.styurl) {
        const urls = Array.isArray(detail.styurls.styurl)
          ? detail.styurls.styurl
          : [detail.styurls.styurl];
        styurls = urls.filter(Boolean).join('; ');
      }
  
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
  
  // 전체 페이지 수집 + 병렬 처리
  async function collectAllMusicals(rowsPerPage = 10, maxPages = 100) {
    let page = 1;
    const allMusicals = [];
  
    while (page <= maxPages) {
      const list = await fetchMusicalList(page, rowsPerPage);
      if (list.length === 0) break;
  
      console.log(`🔍 상세 API 병렬 호출 중 (page ${page})...`);
      const details = await Promise.all(
        list.map(item => fetchMusicalDetail(item.mt20id))
      );
  
      const valid = details.filter(Boolean);
      allMusicals.push(...valid);
  
      console.log(`✅ 유효 공연: ${valid.length}개 / 누적: ${allMusicals.length}개`);
      page++;
    }
  
    return allMusicals;
  }
  
  // 실행
  (async () => {
    const all = await collectAllMusicals(10, 100); // 이미 만들어둔 전체 수집 함수
    console.log(`🎯 총 ${all.length}개 공연 수집됨 → DB 저장 시작`);
    await saveAllToDB(all);
    console.log('🎉 모든 데이터 저장 완료!');
  })();
  
  

