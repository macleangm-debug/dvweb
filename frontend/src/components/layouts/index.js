/**
 * Layout Components for DataVision International
 * Provides different layouts for different page types
 */

import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * MainLayout - For pages that need the standard Navbar and Footer
 * Used for: Homepage, About, Services, Industries, etc.
 */
export const MainLayout = ({ children, Navbar, Footer }) => {
  return (
    <>
      <Navbar />
      <main>
        {children || <Outlet />}
      </main>
      <Footer />
    </>
  );
};

/**
 * AuthLayout - For authentication pages (login, register)
 * No navbar or footer, full-screen experience
 */
export const AuthLayout = ({ children }) => {
  return (
    <main className="min-h-screen">
      {children || <Outlet />}
    </main>
  );
};

/**
 * ProductLandingLayout - For product landing pages (FieldForce, Survey360)
 * These pages have their own headers/footers
 */
export const ProductLandingLayout = ({ children }) => {
  return (
    <main className="min-h-screen">
      {children || <Outlet />}
    </main>
  );
};

/**
 * ProductAppLayout - For product app pages (dashboards, forms, etc.)
 * Full-screen product experience with product-specific navigation
 */
export const ProductAppLayout = ({ children }) => {
  return (
    <main className="min-h-screen">
      {children || <Outlet />}
    </main>
  );
};

/**
 * AdminLayout - For admin/CMS pages
 * No main site navbar, uses admin sidebar
 */
export const AdminLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-gray-50">
      {children || <Outlet />}
    </main>
  );
};

export default { MainLayout, AuthLayout, ProductLandingLayout, ProductAppLayout, AdminLayout };
