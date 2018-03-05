import * as React from 'react';

import TroughTwat from './TroughTwat';
import './Trough.scss';

const Trough = ({ twats }) => (
  <div className="trough">
    {twats.map(twat => <TroughTwat twat={twat} key={twat.id} />)}
  </div>
);

export default Trough;
