import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import EnhancedApp from './EnhancedApp';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/widget/:publicId" element={<EnhancedApp/>}/>
        <Route path="*" element={<EnhancedApp/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
