import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import ExercisesPage from './pages/ExercisesPage';
import WorkoutPage from './pages/WorkoutPage';
import AccountPage from './pages/AccountPage';
import RoutinesPage from './pages/RoutinesPage';
import RecoverPage from './pages/RecoverPage';
import DatabaseViewer from './pages/DatabaseViewer';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import Trainers from './pages/Trainers';
import TrainerProfile from './pages/TrainerProfile';
import TrainerLogin from './pages/TrainerLogin';
import Programs from './pages/Programs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Authenticated Dashboard Pages */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/exercises" element={<ExercisesPage />} />
        <Route path="/dashboard/workout" element={<WorkoutPage />} />
        <Route path="/dashboard/account" element={<AccountPage />} />
        <Route path="/dashboard/routines" element={<RoutinesPage />} />
        <Route path="/dashboard/recover" element={<RecoverPage />} />

        {/* Existing & Auxiliary Pages */}
        <Route path="/profile" element={<AccountPage />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/trainers/:id" element={<TrainerProfile />} />
        <Route path="/trainer/login" element={<TrainerLogin />} />
        <Route path="/admin/db" element={<DatabaseViewer />} />
        <Route path="/programs" element={<Programs />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
