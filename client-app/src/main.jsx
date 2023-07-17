import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './services/localizer';
import LoadingAnimation from './components/LoadingAnimation/LoadingAnimation';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<LoadingAnimation loadingCurveWidth='5px' size='18px' isCenter={true} />}>
    <App />
  </Suspense>
);