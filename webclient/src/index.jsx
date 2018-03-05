import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';

const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
  <BrowserRouter forceRefresh={!supportsHistory}><App /></BrowserRouter>,
  document.getElementById('wrapper'),
);
