const db = require('../db');

async function saveMusicalToDB(musical) {
  const {
    mt20id, prfnm, poster, prfpdfrom, prfpdto,
    musicallicense, musicalcreate, prfcast
  } = musical;

  const query = `
    INSERT INTO TB_MUSICAL (
      MUSICAL_ID, MUSICAL_TITLE, MUSICAL_POSTER,
      MUSICAL_ST_DT, MUSICAL_ED_DT,
      MUSICAL_LICENSE, MUSICAL_CREATE, MUSICAL_CAST
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      MUSICAL_TITLE = VALUES(MUSICAL_TITLE),
      MUSICAL_POSTER = VALUES(MUSICAL_POSTER),
      MUSICAL_ST_DT = VALUES(MUSICAL_ST_DT),
      MUSICAL_ED_DT = VALUES(MUSICAL_ED_DT),
      MUSICAL_LICENSE = VALUES(MUSICAL_LICENSE),
      MUSICAL_CREATE = VALUES(MUSICAL_CREATE),
      MUSICAL_CAST = VALUES(MUSICAL_CAST)
  `;

  await db.query(query, [
    mt20id, prfnm, poster,
    prfpdfrom, prfpdto,
    musicallicense, musicalcreate, prfcast
  ]);
}

async function saveShowToDB(musical) {
    const {
      mt20id, fcltynm, dtguidance,
      prfruntime, pcseguidance, styurls, prfcast
    } = musical;
  
    const query = `
      INSERT INTO TB_SHOW (
        MUSICAL_ID, HALL_NAME, SHOW_DT,
        SHOW_RUNTIME, SHOW_PRICE, SHOW_IMGS, SHOW_CAST
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    await db.query(query, [
      mt20id,
      fcltynm,
      dtguidance,
      prfruntime,
      pcseguidance,
      styurls,
      prfcast
    ]);
  }
  
  async function saveAllToDB(musicalList) {
    for (const musical of musicalList) {
      try {
        await saveMusicalToDB(musical);
        await saveShowToDB(musical);
        console.log(`✅ 저장 완료: ${musical.prfnm}`);
      } catch (err) {
        console.error(`❌ 저장 실패: ${musical.mt20id} (${musical.prfnm})`, err.message);
      }
    }
  }
  
  module.exports = {
    saveAllToDB,
    saveMusicalToDB,
    saveShowToDB,
  };
  