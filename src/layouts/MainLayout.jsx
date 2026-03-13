import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdvertisementBanner from '@/components/AdvertisementBanner';

function MainLayout() {
  return (
    <div className="surface-base min-h-screen flex flex-col">
      <AdvertisementBanner />
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;