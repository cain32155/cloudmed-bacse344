const express = require('express');
const router = express.Router();
const db = require('../db');

// READ: Get all doctors
router.get('/', (req, res) => {
  try {
    const doctors = db.prepare('SELECT * FROM doctors ORDER BY name ASC').all();
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ: Get doctor by ID
router.get('/:id', (req, res) => {
  try {
    const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE: Add new doctor
router.post('/', (req, res) => {
  const { name, specialty, email, phone, department, available_days } = req.body;

  if (!name || !specialty || !email || !phone || !department || !available_days) {
    return res.status(400).json({ success: false, message: 'Missing required doctor fields' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO doctors (name, specialty, email, phone, department, available_days)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, specialty, email, phone, department, available_days);
    const newDoctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, data: newDoctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
