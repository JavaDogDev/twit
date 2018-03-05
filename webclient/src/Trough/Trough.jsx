import * as React from 'react';

import TroughTwat from './trough-twat';
import TwatButton from '../misc/twat-button';
import './trough.scss';

const Trough = ({ twats }) => (
  <div className="trough">
    <TwitComposerInline />
    {twats.map(twat => <TroughTwat twat={twat} key={twat.id} />)}
  </div>
);

const TwitComposerInline = () => (
  <div className="twit-composer-inline">
    <div className="user-icon">
      <i className="material-icons">face</i>
    </div>
    <input type="text" placeholder="Don't think, just type." />
    <TwatButton />
  </div>
);

export default Trough;
