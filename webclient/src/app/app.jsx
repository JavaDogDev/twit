import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './login';
import Dashboard from './dashboard';

import './app.scss';

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route path="/" component={Dashboard} />
  </Switch>
);

export default App;
