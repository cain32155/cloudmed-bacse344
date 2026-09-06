import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AppointmentsList from './components/AppointmentsList';
import PatientDirectory from './components/PatientDirectory';
import DoctorsDirectory from './components/DoctorsDirectory';
import ApiDocsView from './components/ApiDocsView';
import CloudArchitectureView from './components/CloudArchitectureView';
import BookAppointmentModal from './components/BookAppointmentModal';
import EditAppointmentModal from './components/EditAppointmentModal';
import AddPatientModal from './components/AddPatientModal';
import EditPatientModal from './components/EditPatientModal';

const API_BASE = '/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Application Data States
  const [stats, setStats] = useState({
    totalAppointments: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0
  });

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Loading & Notification states
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal Control States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all initial data
  const fetchData = async () => {
    try {
      const [analyticsRes, appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        axios.get(`${API_BASE}/analytics/overview`),
        axios.get(`${API_BASE}/appointments`),
        axios.get(`${API_BASE}/patients`),
        axios.get(`${API_BASE}/doctors`)
      ]);

      if (analyticsRes.data.success) setStats(analyticsRes.data.data);
      if (appointmentsRes.data.success) setAppointments(appointmentsRes.data.data);
      if (patientsRes.data.success) setPatients(patientsRes.data.data);
      if (doctorsRes.data.success) setDoctors(doctorsRes.data.data);
    } catch (error) {
      console.error('API Error, check backend connection:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CRUD ACTION HANDLERS ---

  // 1. CREATE APPOINTMENT (POST)
  const handleBookAppointment = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE}/appointments`, formData);
      if (res.data.success) {
        showToast('Appointment booked successfully!');
        fetchData();
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error booking appointment.');
    }
  };

  // 2. UPDATE APPOINTMENT (PUT)
  const handleUpdateAppointment = async (id, formData) => {
    try {
      const res = await axios.put(`${API_BASE}/appointments/${id}`, formData);
      if (res.data.success) {
        showToast(`Appointment #${id} updated successfully!`);
        fetchData();
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating appointment.');
    }
  };

  // 3. DELETE APPOINTMENT (DELETE)
  const handleDeleteAppointment = async (id) => {
    if (!window.confirm(`Are you sure you want to cancel and delete Appointment #${id}?`)) return;
    try {
      const res = await axios.delete(`${API_BASE}/appointments/${id}`);
      if (res.data.success) {
        showToast(`Appointment #${id} deleted from system.`);
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete appointment', 'error');
    }
  };

  // 4. CREATE PATIENT (POST)
  const handleAddPatient = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE}/patients`, formData);
      if (res.data.success) {
        showToast('New patient registered successfully!');
        fetchData();
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating patient.');
    }
  };

  // 5. UPDATE PATIENT (PUT)
  const handleUpdatePatient = async (id, formData) => {
    try {
      const res = await axios.put(`${API_BASE}/patients/${id}`, formData);
      if (res.data.success) {
        showToast(`Patient #${id} record updated!`);
        fetchData();
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating patient record.');
    }
  };

  // 6. DELETE PATIENT (DELETE)
  const handleDeletePatient = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Patient #${id}? All related appointments will also be deleted.`)) return;
    try {
      const res = await axios.delete(`${API_BASE}/patients/${id}`);
      if (res.data.success) {
        showToast(`Patient #${id} deleted.`);
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete patient', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold flex items-center gap-2 animate-bounce ${
          toast.type === 'error'
            ? 'bg-rose-900/90 border-rose-600 text-rose-200'
            : 'bg-emerald-900/90 border-emerald-600 text-emerald-200'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBookClick={() => setIsBookModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              appointments={appointments}
              setActiveTab={setActiveTab}
              onBookClick={() => setIsBookModalOpen(true)}
              onEditAppointment={(apt) => setEditingAppointment(apt)}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsList
              appointments={appointments}
              onBookClick={() => setIsBookModalOpen(true)}
              onEditAppointment={(apt) => setEditingAppointment(apt)}
              onDeleteAppointment={handleDeleteAppointment}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
          )}

          {activeTab === 'patients' && (
            <PatientDirectory
              patients={patients}
              onAddPatientClick={() => setIsAddPatientModalOpen(true)}
              onEditPatient={(p) => setEditingPatient(p)}
              onDeletePatient={handleDeletePatient}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorsDirectory doctors={doctors} />
          )}

          {activeTab === 'apidocs' && (
            <ApiDocsView />
          )}

          {activeTab === 'cloudarch' && (
            <CloudArchitectureView />
          )}
        </main>
      </div>

      {/* Modals */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        patients={patients}
        doctors={doctors}
        onBookSuccess={handleBookAppointment}
      />

      <EditAppointmentModal
        isOpen={!!editingAppointment}
        onClose={() => setEditingAppointment(null)}
        appointment={editingAppointment}
        doctors={doctors}
        onUpdateSuccess={handleUpdateAppointment}
      />

      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onAddSuccess={handleAddPatient}
      />

      <EditPatientModal
        isOpen={!!editingPatient}
        onClose={() => setEditingPatient(null)}
        patient={editingPatient}
        onUpdateSuccess={handleUpdatePatient}
      />
    </div>
  );
}
