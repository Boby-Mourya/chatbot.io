import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import MarketApp from './MarketApp';
import './styles.css';
import './manager-demo.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MarketApp/>
    </BrowserRouter>
  </React.StrictMode>
);
