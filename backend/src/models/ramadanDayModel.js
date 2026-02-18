const { pool } = require('../config/db');

// Create ramadan_days table if it doesn't exist
const createRamadanDaysTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ramadan_days (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      uucms VARCHAR(50) NOT NULL,
      day INTEGER NOT NULL CHECK (day BETWEEN 1 AND 30),

      -- SALAH (fard prayers stored as text: takbir/jamaat/ada/qaza/false)
      fajr VARCHAR(10),
      dhuhr VARCHAR(10),
      asr VARCHAR(10),
      maghrib VARCHAR(10),
      isha VARCHAR(10),
      witr BOOLEAN,
      taraweeh INTEGER CHECK (taraweeh BETWEEN 0 AND 20),

      -- SUNNAH
      sunnah_fajr INTEGER,
      before_dhuhr INTEGER,
      after_dhuhr INTEGER,
      before_asr INTEGER,
      before_maghrib INTEGER,
      after_maghrib INTEGER,
      awwabeen INTEGER,
      before_isha INTEGER,
      after_isha INTEGER,
      tahajjud INTEGER,
      duha INTEGER,

      -- QURAN
      start_page INTEGER CHECK (start_page BETWEEN 1 AND 612),
      current_page INTEGER CHECK (current_page BETWEEN 1 AND 612),
      khatam_count INTEGER DEFAULT 0,

      -- DHIKR
      subhanallah BOOLEAN,
      alhamdulillah BOOLEAN,
      allahu_akbar BOOLEAN,
      daroodh BOOLEAN,

      -- DISCIPLINE
      screen_time INTEGER CHECK (screen_time BETWEEN 0 AND 5),

      -- REFLECTION (good deeds — true if user wrote something)
      gratitude1 BOOLEAN DEFAULT false,
      gratitude2 BOOLEAN DEFAULT false,
      gratitude3 BOOLEAN DEFAULT false,
      gratitude4 BOOLEAN DEFAULT false,
      gratitude5 BOOLEAN DEFAULT false,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(user_id, day)
    );
  `;
  await pool.query(query);

  // Add columns if table already exists (safe migration)
  const alterQueries = [
    'ALTER TABLE ramadan_days ADD COLUMN IF NOT EXISTS gratitude1 BOOLEAN DEFAULT false',
    'ALTER TABLE ramadan_days ADD COLUMN IF NOT EXISTS gratitude2 BOOLEAN DEFAULT false',
    'ALTER TABLE ramadan_days ADD COLUMN IF NOT EXISTS gratitude3 BOOLEAN DEFAULT false',
    'ALTER TABLE ramadan_days ADD COLUMN IF NOT EXISTS gratitude4 BOOLEAN DEFAULT false',
    'ALTER TABLE ramadan_days ADD COLUMN IF NOT EXISTS gratitude5 BOOLEAN DEFAULT false',
  ];
  for (const q of alterQueries) {
    await pool.query(q);
  }
};

// Upsert (insert or update) a day's data
const upsertDayData = async (userId, uucms, day, data) => {
  const query = `
    INSERT INTO ramadan_days (
      user_id, uucms, day,
      fajr, dhuhr, asr, maghrib, isha, witr, taraweeh,
      sunnah_fajr, before_dhuhr, after_dhuhr, before_asr,
      before_maghrib, after_maghrib, awwabeen,
      before_isha, after_isha, tahajjud, duha,
      start_page, current_page, khatam_count,
      subhanallah, alhamdulillah, allahu_akbar, daroodh,
      screen_time,
      gratitude1, gratitude2, gratitude3, gratitude4, gratitude5
    ) VALUES (
      $1, $2, $3,
      $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14,
      $15, $16, $17,
      $18, $19, $20, $21,
      $22, $23, $24,
      $25, $26, $27, $28,
      $29,
      $30, $31, $32, $33, $34
    )
    ON CONFLICT (user_id, day) DO UPDATE SET
      fajr = EXCLUDED.fajr,
      dhuhr = EXCLUDED.dhuhr,
      asr = EXCLUDED.asr,
      maghrib = EXCLUDED.maghrib,
      isha = EXCLUDED.isha,
      witr = EXCLUDED.witr,
      taraweeh = EXCLUDED.taraweeh,
      sunnah_fajr = EXCLUDED.sunnah_fajr,
      before_dhuhr = EXCLUDED.before_dhuhr,
      after_dhuhr = EXCLUDED.after_dhuhr,
      before_asr = EXCLUDED.before_asr,
      before_maghrib = EXCLUDED.before_maghrib,
      after_maghrib = EXCLUDED.after_maghrib,
      awwabeen = EXCLUDED.awwabeen,
      before_isha = EXCLUDED.before_isha,
      after_isha = EXCLUDED.after_isha,
      tahajjud = EXCLUDED.tahajjud,
      duha = EXCLUDED.duha,
      start_page = EXCLUDED.start_page,
      current_page = EXCLUDED.current_page,
      khatam_count = EXCLUDED.khatam_count,
      subhanallah = EXCLUDED.subhanallah,
      alhamdulillah = EXCLUDED.alhamdulillah,
      allahu_akbar = EXCLUDED.allahu_akbar,
      daroodh = EXCLUDED.daroodh,
      screen_time = EXCLUDED.screen_time,
      gratitude1 = EXCLUDED.gratitude1,
      gratitude2 = EXCLUDED.gratitude2,
      gratitude3 = EXCLUDED.gratitude3,
      gratitude4 = EXCLUDED.gratitude4,
      gratitude5 = EXCLUDED.gratitude5
    RETURNING *;
  `;

  const values = [
    userId, uucms, day,
    data.fajr, data.dhuhr, data.asr, data.maghrib, data.isha, data.witr, data.taraweeh,
    data.sunnah_fajr, data.before_dhuhr, data.after_dhuhr, data.before_asr,
    data.before_maghrib, data.after_maghrib, data.awwabeen,
    data.before_isha, data.after_isha, data.tahajjud, data.duha,
    data.start_page, data.current_page, data.khatam_count,
    data.subhanallah, data.alhamdulillah, data.allahu_akbar, data.daroodh,
    data.screen_time,
    data.gratitude1, data.gratitude2, data.gratitude3, data.gratitude4, data.gratitude5
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get a specific day's data for a user
const getDayDataByUser = async (userId, day) => {
  const result = await pool.query(
    'SELECT * FROM ramadan_days WHERE user_id = $1 AND day = $2',
    [userId, day]
  );
  return result.rows[0];
};

// Get all days data for a user
const getAllDaysDataByUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM ramadan_days WHERE user_id = $1 ORDER BY day',
    [userId]
  );
  return result.rows;
};

module.exports = { createRamadanDaysTable, upsertDayData, getDayDataByUser, getAllDaysDataByUser };
