import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// MSW desabilitado temporariamente para usar Firebase real
// async function enableMocking() {
//   if (import.meta.env.MODE !== 'development') {
//     return;
//   }

//   const { worker } = await import('./mocks/browser');

//   return worker.start();
// }

// enableMocking().then(() => {
//   ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// });

// Inicialização direta sem MSW
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

