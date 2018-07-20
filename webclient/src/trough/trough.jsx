import * as React from 'react';

import ListTwat from '../misc/list-twat';
import InlineLoadingSpinner from '../misc/inline-loading-spinner';
import TwatComposerInline from './twat-composer-inline';
import './trough.scss';

const Trough = ({ twats, isLoading, showTwatComposer }) => (
  <div className="trough">
    {showTwatComposer ? <TwatComposerInline /> : null}
    {isLoading ? <InlineLoadingSpinner /> : null}
    {twats.map(twat => <ListTwat twat={twat} key={twat._id} />)}
  </div>
);

export default Trough;
