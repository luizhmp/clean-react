import React from 'react';
import { Login } from '@/presentation/pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
