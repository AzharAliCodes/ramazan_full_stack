const express = require('express');
const router = express.Router();
const { saveDay, getDay, getAllDays } = require('../controllers/ramadanDayController');

// POST /api/days/save — Upsert a day's data
router.post('/save', saveDay);

// GET /api/days/:userId — Get all days for a user
router.get('/:userId', getAllDays);

// GET /api/days/:userId/:day — Get a specific day
router.get('/:userId/:day', getDay);

module.exports = router;
