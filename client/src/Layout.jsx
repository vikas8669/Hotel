import React from 'react';
import Navbar from './components/navbars/Navbar';
import { Outlet } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';

const Layout = () => {
  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen">
        {/* Sticky Navbar on top */}
        <Navbar />

        {/* Main content below the navbar */}
        <main className="mt-[64px] flex-grow px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </SearchProvider>
  );
};

export default Layout;
