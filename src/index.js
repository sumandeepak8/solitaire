import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <App spade="&#9824;" heart="&#9829;" club="&#9827;" diamond="&#9830;" />,
  document.getElementById('root')
);

serviceWorker.unregister();
