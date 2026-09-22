import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

// Public pages
import Home from './pages/Home'
import Donate from './pages/Donate'
import DonationSuccess from './pages/DonationSuccess'
import Contributors from './pages/Contributors'
import MyDonations from './pages/MyDonations'
import NotFound from './pages/NotFound'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDonations from './pages/admin/AdminDonations'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1f2937', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/donation-success" element={<DonationSuccess />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/my-donations" element={<MyDonations />} />
            {/* Redirect old login routes to home */}
            <Route path="/login" element={<Navigate to="/" replace />} />
          </Route>

          {/* Admin Routes - no login needed, auto-login on access */}
          <Route path="/admin/login" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
