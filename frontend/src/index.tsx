import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/App.css';
import 'maplibre-gl/dist/maplibre-gl.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
