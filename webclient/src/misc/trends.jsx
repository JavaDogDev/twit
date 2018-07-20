import * as React from 'react';

import './trends.scss';

const Trends = () => (
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
);

module.exports = Trends;
