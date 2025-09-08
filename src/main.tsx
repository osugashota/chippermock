import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MainLayout } from './components/layout/MainLayout';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainLayout />
  </StrictMode>
);
