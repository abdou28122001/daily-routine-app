import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-hidden relative">
        {/* Dynamic Background Elements */}
        {/* Routes */}
        <div className="relative z-10 h-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
          },
        }} />
      </div>
    </BrowserRouter>
  );
}

export default App;
