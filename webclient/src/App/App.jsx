import * as React from 'react';
import { hot } from 'react-hot-loader';

import NavBar from './NavBar';
import Trough from '../Trough/Trough';
import './App.scss';

const App = () => (
  <div className="wrapper">
    <NavBar />

    <main>
      <Trough />
    </main>
  </div>
);

export default hot(module)(App);
