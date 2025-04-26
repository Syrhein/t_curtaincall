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

  try {
    // ✅ musicalId로 중복 확인
    const [existing] = await db.query(
      `SELECT SHOW_IDX FROM TB_SHOW WHERE MUSICAL_ID = ?`,
      [mt20id]
    );

    if (existing.length > 0) {
      console.log(`🎭 이미 등록된 공연 (musicalId=${mt20id}), 쇼 저장 스킵`);
      return; // 이미 존재 → 저장 안함
    }

    // ✅ 존재하지 않으면 INSERT
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

    console.log(`🎭 쇼 저장 완료: ${mt20id}`);

  } catch (err) {
    console.error(`❌ 쇼 저장 실패 (musicalId=${mt20id}):`, err.message);
  }
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
  