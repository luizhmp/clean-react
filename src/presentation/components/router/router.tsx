import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

interface RouterInterface {
  makeLogin(): JSX.Element;
}

export function Router({ makeLogin }: RouterInterface): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={makeLogin()} />
      </Routes>
    </BrowserRouter>
  );
}
