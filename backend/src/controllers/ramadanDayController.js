const { upsertDayData, getDayDataByUser, getAllDaysDataByUser } = require('../models/ramadanDayModel');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/days/save — Upsert a day's tracking data
const saveDay = async (req, res, next) => {
  try {
    const { user_id, uucms, day, salah, quran, dhikr, discipline, goodDeeds } = req.body;

    if (!user_id || !uucms || !day) {
      return errorResponse(res, 400, 'user_id, uucms, and day are required.');
    }

    if (day < 1 || day > 30) {
      return errorResponse(res, 400, 'Day must be between 1 and 30.');
    }

    // Map frontend data to DB columns
    const data = {
      // Salah fard — convert false to null for DB
      fajr: salah?.fajr || null,
      dhuhr: salah?.dhuhr || null,
      asr: salah?.asr || null,
      maghrib: salah?.maghrib || null,
      isha: salah?.isha || null,
      witr: salah?.witr || false,
      taraweeh: salah?.taraweeh || 0,

      // Sunnah
      sunnah_fajr: salah?.sunnahFajr || 0,
      before_dhuhr: salah?.sunnahBeforeDhuhr || 0,
      after_dhuhr: salah?.sunnahAfterDhuhr || 0,
      before_asr: salah?.sunnahBeforeAsr || 0,
      before_maghrib: salah?.sunnahBeforeMaghrib || 0,
      after_maghrib: salah?.sunnahAfterMaghrib || 0,
      awwabeen: salah?.awwabeen || 0,
      before_isha: salah?.sunnahBeforeIsha || 0,
      after_isha: salah?.sunnahAfterIsha || 0,
      tahajjud: salah?.tahajjud || 0,
      duha: salah?.duha || 0,

      // Quran
      start_page: quran?.startPage || null,
      current_page: quran?.currentPage || null,
      khatam_count: quran?.khatamCount || 0,

      // Dhikr — convert number values (0/400) to boolean
      subhanallah: (dhikr?.subhanallah || 0) > 0,
      alhamdulillah: (dhikr?.alhamdulillah || 0) > 0,
      allahu_akbar: (dhikr?.allahuAkbar || 0) > 0,
      daroodh: (dhikr?.daroodh || 0) > 0,

      // Discipline
      screen_time: discipline?.screenTime != null ? Math.round(discipline.screenTime) : 0,

      // Good Deeds — true if user wrote something, false if empty
      gratitude1: !!(goodDeeds?.[0]?.trim()),
      gratitude2: !!(goodDeeds?.[1]?.trim()),
      gratitude3: !!(goodDeeds?.[2]?.trim()),
      gratitude4: !!(goodDeeds?.[3]?.trim()),
      gratitude5: !!(goodDeeds?.[4]?.trim()),
    };

    const result = await upsertDayData(user_id, uucms, day, data);

    return successResponse(res, 200, 'Day data saved successfully!', { day: result });
  } catch (error) {
    console.error('Save day error:', error.message);
    next(error);
  }
};

// GET /api/days/:userId/:day — Get a specific day
const getDay = async (req, res, next) => {
  try {
    const { userId, day } = req.params;

    const result = await getDayDataByUser(userId, parseInt(day));

    if (!result) {
      return errorResponse(res, 404, 'No data found for this day.');
    }

    return successResponse(res, 200, 'Day data fetched successfully!', { day: result });
  } catch (error) {
    console.error('Get day error:', error.message);
    next(error);
  }
};

// GET /api/days/:userId — Get all days for a user
const getAllDays = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await getAllDaysDataByUser(userId);

    return successResponse(res, 200, 'All days fetched successfully!', { days: result });
  } catch (error) {
    console.error('Get all days error:', error.message);
    next(error);
  }
};

module.exports = { saveDay, getDay, getAllDays };
