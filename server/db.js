const fs = require('fs');
const path = require('path');

const dbFile = path.resolve(__dirname, 'cloudmed_db.json');

const defaultData = {
  doctors: [
    {
      id: 1,
      name: 'Dr. Sarah Jenkins',
      specialty: 'Cardiology',
      email: 'sarah.jenkins@cloudmed.org',
      phone: '+1-555-0143',
      department: 'Cardiovascular Health',
      available_days: 'Mon, Wed, Fri',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Dr. Rajesh Patel',
      specialty: 'Neurology',
      email: 'rajesh.patel@cloudmed.org',
      phone: '+1-555-0188',
      department: 'Neurosciences',
      available_days: 'Tue, Thu, Sat',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Dr. Emily Vance',
      specialty: 'Pediatrics',
      email: 'emily.vance@cloudmed.org',
      phone: '+1-555-0199',
      department: 'Pediatric Care',
      available_days: 'Mon, Tue, Wed, Thu',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Dr. Marcus Aurelius',
      specialty: 'Orthopedics',
      email: 'marcus.a@cloudmed.org',
      phone: '+1-555-0122',
      department: 'Bone & Joint',
      available_days: 'Wed, Thu, Fri',
      created_at: new Date().toISOString()
    }
  ],
  patients: [
    {
      id: 1,
      name: 'Alice Johnson',
      age: 34,
      gender: 'Female',
      blood_group: 'A+',
      phone: '+1-555-4321',
      email: 'alice.j@example.com',
      address: '742 Evergreen Terrace, Springfield',
      medical_history: 'Mild Asthma',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Robert Miller',
      age: 52,
      gender: 'Male',
      blood_group: 'O+',
      phone: '+1-555-8765',
      email: 'robert.m@example.com',
      address: '123 Elm Street, Metropolis',
      medical_history: 'Hypertension',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Sophia Chen',
      age: 28,
      gender: 'Female',
      blood_group: 'B+',
      phone: '+1-555-9012',
      email: 'sophia.c@example.com',
      address: '456 Oak Avenue, Gotham',
      medical_history: 'No prior chronic issues',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'David Williams',
      age: 45,
      gender: 'Male',
      blood_group: 'AB-',
      phone: '+1-555-3456',
      email: 'david.w@example.com',
      address: '789 Pine Road, Star City',
      medical_history: 'Type 2 Diabetes',
      created_at: new Date().toISOString()
    }
  ],
  appointments: [
    {
      id: 1,
      patient_id: 1,
      doctor_id: 1,
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '10:00 AM',
      reason: 'Routine Cardiac Checkup',
      status: 'Scheduled',
      notes: 'Patient requested morning slot.',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      patient_id: 2,
      doctor_id: 2,
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '02:30 PM',
      reason: 'Migraine Consultation',
      status: 'Scheduled',
      notes: 'Follow-up on MRI scans.',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      patient_id: 3,
      doctor_id: 3,
      appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      appointment_time: '11:15 AM',
      reason: 'Annual Health Assessment',
      status: 'Scheduled',
      notes: 'First visit.',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      patient_id: 4,
      doctor_id: 4,
      appointment_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      appointment_time: '09:00 AM',
      reason: 'Knee Pain Follow-up',
      status: 'Scheduled',
      notes: 'Post-xray review.',
      created_at: new Date().toISOString()
    }
  ],
  counters: {
    doctors: 4,
    patients: 4,
    appointments: 4
  }
};

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify(defaultData, null, 2));
}

function loadData() {
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return defaultData;
  }
}

function saveData(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

class DB {
  prepare(sql) {
    const cleanSql = sql.trim().toLowerCase();

    return {
      all: (...args) => {
        const data = loadData();
        if (cleanSql.includes('from doctors')) {
          return data.doctors;
        }
        if (cleanSql.includes('from patients')) {
          if (cleanSql.includes('where id =')) {
            const id = Number(args[0]);
            return data.patients.filter(p => p.id === id);
          }
          if (cleanSql.includes('like')) {
            const term = (args[0] || '').replace(/%/g, '').toLowerCase();
            return data.patients.filter(p => 
              p.name.toLowerCase().includes(term) ||
              p.email.toLowerCase().includes(term) ||
              p.phone.includes(term) ||
              p.blood_group.toLowerCase().includes(term)
            );
          }
          return data.patients;
        }
        if (cleanSql.includes('from appointments')) {
          let list = data.appointments.map(a => {
            const p = data.patients.find(pt => pt.id === Number(a.patient_id)) || {};
            const d = data.doctors.find(doc => doc.id === Number(a.doctor_id)) || {};
            return {
              ...a,
              patient_name: p.name || 'Unknown Patient',
              patient_phone: p.phone || '',
              patient_email: p.email || '',
              patient_blood_group: p.blood_group || '',
              doctor_name: d.name || 'Unknown Doctor',
              doctor_specialty: d.specialty || '',
              doctor_department: d.department || ''
            };
          });

          // Apply filters
          if (args.length > 0) {
            if (cleanSql.includes('a.status =')) {
              const statusVal = args[0];
              list = list.filter(a => a.status === statusVal);
            }
          }

          return list;
        }

        return [];
      },

      get: (...args) => {
        const data = loadData();
        if (cleanSql.includes('count(*)')) {
          if (cleanSql.includes('doctors')) return { count: data.doctors.length };
          if (cleanSql.includes('patients')) return { count: data.patients.length };
          if (cleanSql.includes('appointments')) {
            if (cleanSql.includes("status = 'scheduled'")) {
              return { count: data.appointments.filter(a => a.status === 'Scheduled').length };
            }
            if (cleanSql.includes("status = 'completed'")) {
              return { count: data.appointments.filter(a => a.status === 'Completed').length };
            }
            if (cleanSql.includes("status = 'cancelled'")) {
              return { count: data.appointments.filter(a => a.status === 'Cancelled').length };
            }
            if (cleanSql.includes('appointment_date =')) {
              const targetDate = args[0];
              return { count: data.appointments.filter(a => a.appointment_date === targetDate).length };
            }
            return { count: data.appointments.length };
          }
        }
        if (cleanSql.includes('from doctors where id =')) {
          return data.doctors.find(d => d.id === Number(args[0])) || null;
        }
        if (cleanSql.includes('from patients where id =')) {
          return data.patients.find(p => p.id === Number(args[0])) || null;
        }
        if (cleanSql.includes('from appointments')) {
          const apt = data.appointments.find(a => a.id === Number(args[0]));
          if (!apt) return null;
          const p = data.patients.find(pt => pt.id === Number(apt.patient_id)) || {};
          const d = data.doctors.find(doc => doc.id === Number(apt.doctor_id)) || {};
          return {
            ...apt,
            patient_name: p.name || 'Unknown Patient',
            patient_phone: p.phone || '',
            patient_email: p.email || '',
            patient_age: p.age || 0,
            patient_gender: p.gender || '',
            doctor_name: d.name || 'Unknown Doctor',
            doctor_specialty: d.specialty || '',
            doctor_department: d.department || ''
          };
        }
        return null;
      },

      run: (...args) => {
        const data = loadData();
        if (cleanSql.includes('insert into doctors')) {
          data.counters.doctors += 1;
          const newDoc = {
            id: data.counters.doctors,
            name: args[0],
            specialty: args[1],
            email: args[2],
            phone: args[3],
            department: args[4],
            available_days: args[5],
            created_at: new Date().toISOString()
          };
          data.doctors.push(newDoc);
          saveData(data);
          return { lastInsertRowid: newDoc.id };
        }
        if (cleanSql.includes('insert into patients')) {
          if (data.patients.some(p => p.email === args[5])) {
            throw new Error('UNIQUE constraint failed: patients.email');
          }
          data.counters.patients += 1;
          const newPatient = {
            id: data.counters.patients,
            name: args[0],
            age: Number(args[1]),
            gender: args[2],
            blood_group: args[3],
            phone: args[4],
            email: args[5],
            address: args[6] || '',
            medical_history: args[7] || '',
            created_at: new Date().toISOString()
          };
          data.patients.push(newPatient);
          saveData(data);
          return { lastInsertRowid: newPatient.id };
        }
        if (cleanSql.includes('insert into appointments')) {
          data.counters.appointments += 1;
          const newApt = {
            id: data.counters.appointments,
            patient_id: Number(args[0]),
            doctor_id: Number(args[1]),
            appointment_date: args[2],
            appointment_time: args[3],
            reason: args[4],
            status: 'Scheduled',
            notes: args[5] || '',
            created_at: new Date().toISOString()
          };
          data.appointments.push(newApt);
          saveData(data);
          return { lastInsertRowid: newApt.id };
        }
        if (cleanSql.includes('update patients')) {
          const id = Number(args[8]);
          const index = data.patients.findIndex(p => p.id === id);
          if (index !== -1) {
            data.patients[index] = {
              ...data.patients[index],
              name: args[0],
              age: Number(args[1]),
              gender: args[2],
              blood_group: args[3],
              phone: args[4],
              email: args[5],
              address: args[6],
              medical_history: args[7]
            };
            saveData(data);
          }
          return { changes: 1 };
        }
        if (cleanSql.includes('update appointments')) {
          const id = Number(args[6]);
          const index = data.appointments.findIndex(a => a.id === id);
          if (index !== -1) {
            data.appointments[index] = {
              ...data.appointments[index],
              appointment_date: args[0],
              appointment_time: args[1],
              reason: args[2],
              status: args[3],
              notes: args[4],
              doctor_id: Number(args[5])
            };
            saveData(data);
          }
          return { changes: 1 };
        }
        if (cleanSql.includes('delete from patients')) {
          const id = Number(args[0]);
          data.patients = data.patients.filter(p => p.id !== id);
          data.appointments = data.appointments.filter(a => Number(a.patient_id) !== id);
          saveData(data);
          return { changes: 1 };
        }
        if (cleanSql.includes('delete from appointments')) {
          const id = Number(args[0]);
          data.appointments = data.appointments.filter(a => a.id !== id);
          saveData(data);
          return { changes: 1 };
        }

        return { changes: 0 };
      }
    };
  }
}

module.exports = new DB();
