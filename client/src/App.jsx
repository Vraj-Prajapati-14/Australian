import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { queryClient } from './lib/queryClient';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
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
import TestimonialSubmitPage from './pages/TestimonialSubmitPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminTeamPage from './pages/admin/AdminTeamPage';
import AdminDepartmentsPage from './pages/admin/AdminDepartmentsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminCaseStudiesPage from './pages/admin/AdminCaseStudiesPage';
import AdminInspirationPage from './pages/admin/AdminInspirationPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminContactsPage from './pages/admin/AdminContactsPage';
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage';

function App() {
  return (
    <HelmetProvider>
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
          <AntApp>
            <BrowserRouter>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="case-studies" element={<CaseStudiesPage />} />
                  <Route path="inspiration-gallery" element={<InspirationGalleryPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="services/:slug" element={<ServiceDetailPage />} />
                  <Route path="services/:serviceSlug/:subSlug" element={<ServiceDetailPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="testimonial" element={<TestimonialSubmitPage />} />
                  {/* Legacy routes for backward compatibility */}
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="projects/:slug" element={<ProjectDetailPage />} />
                  <Route path="team" element={<TeamPage />} />
                  <Route path="ute" element={<UtePage />} />
                  <Route path="trailer" element={<TrailerPage />} />
                  <Route path="truck" element={<TruckPage />} />
                  <Route path="inspiration" element={<InspirationGalleryPage />} />
                </Route>

                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="services" element={<AdminServicesPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="projects" element={<AdminProjectsPage />} />
                  <Route path="team" element={<AdminTeamPage />} />
                  <Route path="departments" element={<AdminDepartmentsPage />} />
                  <Route path="contacts" element={<AdminContactsPage />} />
                  <Route path="testimonials" element={<AdminTestimonialsPage />} />
                  <Route path="case-studies" element={<AdminCaseStudiesPage />} />
                  <Route path="inspiration" element={<AdminInspirationPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AntApp>
        </QueryClientProvider>
      </ConfigProvider>
    </HelmetProvider>
  );
}

export default App;
