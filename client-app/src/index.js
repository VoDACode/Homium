import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './localizer';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <App/>
  </Suspense>
);
