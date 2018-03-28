import * as React from 'react';

import ListTwat from '../misc/list-twat';
import './trough.scss';

const Trough = ({ twats }) => (
  <div className="trough">
    <TwitComposerInline />
    {twats.map(twat => <ListTwat twat={twat} key={twat.id} />)}
    {twats.map(twat => <ListTwat twat={twat} key={twat.id + 'a'} />)}
    {twats.map(twat => <ListTwat twat={twat} key={twat.id + 'b'} />)}
    {twats.map(twat => <ListTwat twat={twat} key={twat.id + 'c'} />)}
    {twats.map(twat => <ListTwat twat={twat} key={twat.id + 'd'} />)}
    {twats.map(twat => <ListTwat twat={twat} key={twat.id + 'e'} />)}
  </div>
);

const TwitComposerInline = () => (
  <div className="twit-composer-inline">
    <div className="user-icon">
      <i className="material-icons">face</i>
    </div>
    <input type="text" placeholder="Don't think, just type." />
    <div className="twat-button">Twat</div>
  </div>
);

export default Trough;
