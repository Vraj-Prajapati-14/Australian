import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import './index.css';
import { queryClient } from './lib/queryClient';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ServiceCategoryPage from './pages/ServiceCategoryPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import UtePage from './pages/UtePage';
import TrailerPage from './pages/TrailerPage';
import TruckPage from './pages/TruckPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import InspirationGalleryPage from './pages/InspirationGalleryPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminTeamPage from './pages/admin/AdminTeamPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminCaseStudiesPage from './pages/admin/AdminCaseStudiesPage';
import AdminInspirationPage from './pages/admin/AdminInspirationPage';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/category/:slug" element={<ServiceCategoryPage />} />
              <Route path="services/:slug" element={<ServiceDetailPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:slug" element={<ProjectDetailPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="ute" element={<UtePage />} />
              <Route path="trailer" element={<TrailerPage />} />
              <Route path="truck" element={<TruckPage />} />
              <Route path="case-studies" element={<CaseStudiesPage />} />
              <Route path="inspiration" element={<InspirationGalleryPage />} />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="team" element={<AdminTeamPage />} />
              <Route path="case-studies" element={<AdminCaseStudiesPage />} />
              <Route path="inspiration" element={<AdminInspirationPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
