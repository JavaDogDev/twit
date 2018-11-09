import * as React from 'react';
import { connect } from 'react-redux';

import { refreshDashboardTroughAsync } from '../action-creators/dashboard-actions';
import Trough from '../trough/trough';
import Trends from '../misc/trends';
import './dashboard.scss';

function mapStateToProps(state) {
  return {
    currentUser: state.global.currentUser,
    twats: state.dashboard.twats,
  };
}

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      troughLoading: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(refreshDashboardTroughAsync())
      .then(() => this.setState({ troughLoading: false }));
  }

  render() {
    const { twats, currentUser } = this.props;
    const { troughLoading } = this.state;

    return (
      <div className="dashboard-wrapper">
        <main>
          <div className="user-info">
            <div className="header-image" />

            <div className="user-info-contents">
              <div>
                <i className="material-icons">face</i>
                <div>
                  <div className="display-name">{currentUser.displayName}</div>
                  <div className="username">{`@${currentUser.username}`}</div>
                </div>
              </div>
              <div className="user-stats">
                <div className="user-stats-column">
                  <div>Twats</div>
                  <div>45</div>
                </div>
                <div className="user-stats-column">
                  <div>Following</div>
                  <div>{currentUser.following.length}</div>
                </div>
              </div>
            </div>
          </div>

          <Trough twats={twats} isLoading={troughLoading} showTwatComposer />

          <Trends />
        </main>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Dashboard);
