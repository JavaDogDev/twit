import * as React from 'react';
import { hot } from 'react-hot-loader';

import NavBar from './nav-bar';
import Trough from '../trough/trough';
import './app.scss';

// Just for development...
const devTwats = [
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
  <div className="wrapper">
    <NavBar />

    <main>
      <div className="user-info">&#47;&#47; User info and such</div>

      <Trough twats={devTwats} />

      <div className="trends">
        <h3>Trends for you</h3>
        <ul>
          <li>
            <div className="trend">Trend Thing Here 1</div>
            <div className="twat-quantity">6543 Twats</div>
          </li>
          <li>
            <div className="trend">Trend Thing Here 2</div>
            <div className="twat-quantity">7654 Twats</div>
          </li>
          <li>
            <div className="trend">Trend Thing Here 3</div>
            <div className="twat-quantity">876556 Twats</div>
          </li>
          <li>
            <div className="trend">Trend Thing Here 4</div>
            <div className="twat-quantity">765454 Twats</div>
          </li>
        </ul>
      </div>
    </main>
  </div>
);

export default hot(module)(App);
