const express = require('express');
const router = express.Router();
const db = require('../db');

// READ: Get all patients with search filter
router.get('/', (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM patients';
    let params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR blood_group LIKE ?';
      const term = `%${search}%`;
      params = [term, term, term, term];
    }

    query += ' ORDER BY id DESC';

    const patients = db.prepare(query).all(...params);
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ: Get single patient by ID
router.get('/:id', (req, res) => {
  try {
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    // Also fetch patient's appointments history
    const appointments = db.prepare(`
      SELECT a.*, d.name AS doctor_name, d.specialty AS doctor_specialty
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC
    `).all(req.params.id);

    res.json({ success: true, data: { ...patient, appointments } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE: Add new patient record
router.post('/', (req, res) => {
  const { name, age, gender, blood_group, phone, email, address, medical_history } = req.body;

  if (!name || !age || !gender || !blood_group || !phone || !email) {
    return res.status(400).json({ success: false, message: 'Missing required patient fields' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, Number(age), gender, blood_group, phone, email, address || '', medical_history || '');
    const newPatient = db.prepare('SELECT * FROM patients WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Patient created successfully', data: newPatient });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ success: false, message: 'Patient with this email already exists' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE: Update patient record
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, gender, blood_group, phone, email, address, medical_history } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const stmt = db.prepare(`
      UPDATE patients
      SET name = ?, age = ?, gender = ?, blood_group = ?, phone = ?, email = ?, address = ?, medical_history = ?
      WHERE id = ?
    `);

    stmt.run(
      name || existing.name,
      age ? Number(age) : existing.age,
      gender || existing.gender,
      blood_group || existing.blood_group,
      phone || existing.phone,
      email || existing.email,
      address !== undefined ? address : existing.address,
      medical_history !== undefined ? medical_history : existing.medical_history,
      id
    );

    const updatedPatient = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
    res.json({ success: true, message: 'Patient updated successfully', data: updatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE: Delete patient record
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const existing = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    db.prepare('DELETE FROM patients WHERE id = ?').run(id);
    res.json({ success: true, message: `Patient #${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
