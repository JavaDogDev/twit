import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './app/app';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

const supportsHistory = 'pushState' in window.history;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter forceRefresh={!supportsHistory}>
      <LastLocationProvider>
        <App />
      </LastLocationProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('wrapper'),
);
