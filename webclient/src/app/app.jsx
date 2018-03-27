import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './login';
import Dashboard from './dashboard';

import './app.scss';

// Just for development...
export const devTwats = [
  {
    id: '54325432',
    timestamp: '',
    iconUrl: '',
    twatText: 'Text here 123 Hello',
    user: {
      username: '@Human',
      displayName: 'The Most Human',
    },
    stats: {
      likes: 0,
      retwats: 0,
    },
  },
  {
    id: '6543654376',
    timestamp: '',
    iconUrl: '',
    twatText: 'Text here 123 Hello this is filler text 89695048650-94 there\'s no reason to read all of this lorem ipsum etc etc'
      + '\n\nMaybe if I had more imagination then this would be more interesting',
    stats: {
      likes: 0,
      retwats: 0,
    },
    user: {
      username: '@alsoHuman',
      displayName: 'Fleshy Human 30000',
    },
  },
];

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route path="/" component={Dashboard} />
  </Switch>
);

export default App;
