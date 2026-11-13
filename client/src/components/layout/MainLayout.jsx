import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-agro-500 selection:text-white">
      <Navbar isDashboard={false} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

