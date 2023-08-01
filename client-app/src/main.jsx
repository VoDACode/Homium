import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LoadingAnimation from './components/LoadingAnimation/LoadingAnimation';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Suspense fallback={<LoadingAnimation loadingCurveWidth='5px' size='18px' isCenter={true} />}>
    <App />
  </React.Suspense>
);