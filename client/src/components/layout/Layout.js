import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Pages that don't need the navbar (like landing page)
  const noNavbarPages = ['/', '/login', '/register', '/forgot-password'];
  const showNavbar = user || !noNavbarPages.includes(location.pathname);

  // Pages that don't need the footer
  const noFooterPages = ['/dashboard', '/journal', '/analytics', '/profile'];
  const showFooter = !user || !noFooterPages.some(page => location.pathname.startsWith(page));

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      
      <main className={`flex-1 ${user ? 'pt-16' : ''}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;