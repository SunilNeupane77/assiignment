import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { SurveysPage } from './pages/SurveysPage';
import { CreateSurveyPage } from './pages/CreateSurveyPage';
import { SurveyPage } from './pages/SurveyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard/surveys" />;
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="surveys" element={<SurveysPage />} />
          <Route path="surveys/new" element={<ProtectedRoute adminOnly><CreateSurveyPage /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute adminOnly><AnalyticsPage /></ProtectedRoute>} />
          <Route path="analytics/:id" element={<ProtectedRoute adminOnly><AnalyticsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
