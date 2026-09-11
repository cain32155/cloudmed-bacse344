const express = require('express');
const router = express.Router();
const db = require('../db');

// READ: Get all appointments (with optional filters: status, doctor_id, date, search)
router.get('/', (req, res) => {
  try {
    const { status, doctor_id, patient_id, date, search } = req.query;
    let query = `
      SELECT 
        a.id, a.patient_id, a.doctor_id, a.appointment_date, a.appointment_time, 
        a.reason, a.status, a.notes, a.created_at,
        p.name AS patient_name, p.phone AS patient_phone, p.email AS patient_email, p.blood_group AS patient_blood_group,
        d.name AS doctor_name, d.specialty AS doctor_specialty, d.department AS doctor_department
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }
    if (doctor_id) {
      query += ' AND a.doctor_id = ?';
      params.push(doctor_id);
    }
    if (patient_id) {
      query += ' AND a.patient_id = ?';
      params.push(patient_id);
    }
    if (date) {
      query += ' AND a.appointment_date = ?';
      params.push(date);
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR d.name LIKE ? OR a.reason LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time ASC';

    const appointments = db.prepare(query).all(...params);
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ: Get single appointment details by ID
router.get('/:id', (req, res) => {
  try {
    const appointment = db.prepare(`
      SELECT 
        a.*, 
        p.name AS patient_name, p.phone AS patient_phone, p.email AS patient_email, p.age AS patient_age, p.gender AS patient_gender,
        d.name AS doctor_name, d.specialty AS doctor_specialty, d.department AS doctor_department
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `).get(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE: Book new appointment (supports existing patient_id OR custom new patient name)
router.post('/', (req, res) => {
  let { patient_id, patient_name, patient_age, patient_phone, patient_blood_group, doctor_id, appointment_date, appointment_time, reason, notes } = req.body;

  if ((!patient_id && !patient_name) || !doctor_id || !appointment_date || !appointment_time || !reason) {
    return res.status(400).json({ success: false, message: 'Missing required appointment fields (patient, doctor, date, time, reason)' });
  }

  try {
    // If a custom patient name is provided instead of / in addition to patient_id
    if (!patient_id || patient_id === 'new') {
      if (!patient_name || !patient_name.trim()) {
        return res.status(400).json({ success: false, message: 'Please provide a valid patient name.' });
      }

      const pName = patient_name.trim();
      const slug = pName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'patient';
      const pEmail = `${slug}.${Date.now()}@cloudmed.io`;
      const pPhone = patient_phone || `+1-555-${Math.floor(1000 + Math.random() * 9000)}`;
      const pAge = patient_age ? Number(patient_age) : 28;
      const pBlood = patient_blood_group || 'O+';

      const insertPatientStmt = db.prepare(`
        INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history)
        VALUES (?, ?, 'Other', ?, ?, ?, 'General Registration', 'Added during appointment booking')
      `);
      const patientInfo = insertPatientStmt.run(pName, pAge, pBlood, pPhone, pEmail);
      patient_id = patientInfo.lastInsertRowid;
    } else {
      // Validate existing patient existence
      const patientExists = db.prepare('SELECT id FROM patients WHERE id = ?').get(patient_id);
      if (!patientExists) {
        return res.status(404).json({ success: false, message: 'Invalid patient_id. Patient not found.' });
      }
    }

    // Validate doctor existence
    const doctorExists = db.prepare('SELECT id FROM doctors WHERE id = ?').get(doctor_id);
    if (!doctorExists) {
      return res.status(404).json({ success: false, message: 'Invalid doctor_id. Doctor not found.' });
    }

    const stmt = db.prepare(`
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status, notes)
      VALUES (?, ?, ?, ?, ?, 'Scheduled', ?)
    `);

    const info = stmt.run(patient_id, doctor_id, appointment_date, appointment_time, reason, notes || '');
    
    const newAppointment = db.prepare(`
      SELECT 
        a.*, 
        p.name AS patient_name, p.phone AS patient_phone,
        d.name AS doctor_name, d.specialty AS doctor_specialty
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `).get(info.lastInsertRowid);

    res.status(201).json({ success: true, message: 'Appointment booked successfully', data: newAppointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE: Update appointment (status, date, time, notes, reason)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { appointment_date, appointment_time, reason, status, notes, doctor_id } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (status && !['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value. Must be Scheduled, Completed, or Cancelled' });
    }

    const stmt = db.prepare(`
      UPDATE appointments
      SET appointment_date = ?, appointment_time = ?, reason = ?, status = ?, notes = ?, doctor_id = ?
      WHERE id = ?
    `);

    stmt.run(
      appointment_date || existing.appointment_date,
      appointment_time || existing.appointment_time,
      reason || existing.reason,
      status || existing.status,
      notes !== undefined ? notes : existing.notes,
      doctor_id || existing.doctor_id,
      id
    );

    const updated = db.prepare(`
      SELECT 
        a.*, 
        p.name AS patient_name, p.phone AS patient_phone,
        d.name AS doctor_name, d.specialty AS doctor_specialty
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `).get(id);

    res.json({ success: true, message: 'Appointment updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE: Cancel/Remove appointment
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const existing = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
    res.json({ success: true, message: `Appointment #${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
