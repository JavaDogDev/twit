import * as React from 'react';

import Trough from '../trough/trough';
import Trends from '../misc/trends';
import './dashboard.scss';

const Dashboard = () => (
  <div className="dashboard-wrapper">
    <main>
      <div className="user-info">
        <div className="header-image" />

        <div className="user-info-contents">
          <div>
            <i className="material-icons">face</i>
            <div>
              <div className="display-name">Display Name</div>
              <div className="username">@username</div>
            </div>
          </div>
          <div className="user-stats">
            <div className="user-stats-column">
              <div>Twats</div>
              <div>45</div>
            </div>
            <div className="user-stats-column">
              <div>Following</div>
              <div>954</div>
            </div>
          </div>
        </div>
      </div>

      <Trough />

      <Trends />
    </main>
  </div>
);

export default Dashboard;
