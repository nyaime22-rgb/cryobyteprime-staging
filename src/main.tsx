import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import LoginPage from '@/pages/LoginPage'
import AppShell from '@/pages/AppShell'
import DashboardPage from '@/pages/DashboardPage'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Placeholder routes - to be implemented in future phases */}
            <Route path="students/*" element={<div className="p-4">Students Module - Coming Soon</div>} />
            <Route path="teachers/*" element={<div className="p-4">Teachers Module - Coming Soon</div>} />
            <Route path="courses/*" element={<div className="p-4">Courses Module - Coming Soon</div>} />
            <Route path="attendance/*" element={<div className="p-4">Attendance Module - Coming Soon</div>} />
            <Route path="assessments/*" element={<div className="p-4">Assessments Module - Coming Soon</div>} />
            <Route path="reports/*" element={<div className="p-4">Reports Module - Coming Soon</div>} />
            <Route path="settings/*" element={<div className="p-4">Settings Module - Coming Soon</div>} />
          </Route>
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
