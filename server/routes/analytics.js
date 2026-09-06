const express = require('express');
const router = express.Router();
const db = require('../db');

// READ: System statistics for dashboard overview
router.get('/overview', (req, res) => {
  try {
    const totalAppointments = db.prepare('SELECT COUNT(*) AS count FROM appointments').get().count;
    const scheduledAppointments = db.prepare("SELECT COUNT(*) AS count FROM appointments WHERE status = 'Scheduled'").get().count;
    const completedAppointments = db.prepare("SELECT COUNT(*) AS count FROM appointments WHERE status = 'Completed'").get().count;
    const cancelledAppointments = db.prepare("SELECT COUNT(*) AS count FROM appointments WHERE status = 'Cancelled'").get().count;
    const totalPatients = db.prepare('SELECT COUNT(*) AS count FROM patients').get().count;
    const totalDoctors = db.prepare('SELECT COUNT(*) AS count FROM doctors').get().count;

    const todayStr = new Date().toISOString().split('T')[0];
    const todaysAppointments = db.prepare('SELECT COUNT(*) AS count FROM appointments WHERE appointment_date = ?').get(todayStr).count;

    res.json({
      success: true,
      data: {
        totalAppointments,
        scheduledAppointments,
        completedAppointments,
        cancelledAppointments,
        totalPatients,
        totalDoctors,
        todaysAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
