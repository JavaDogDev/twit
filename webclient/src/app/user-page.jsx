import * as React from 'react';
import classNames from 'classnames';

import Trough from '../trough/trough';
import Trends from '../misc/trends';
import './user-page.scss';

class UserPage extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      userTwats: null,
      userInfoLoading: true,
      userTwatsLoading: true,
      activeNavTab: 'twats'
    };
  }

  render() {
    return (
      <div className="user-page">
        <img className="header-image" src="/dist/img/header-placeholder.jpg" alt="Profile header" />
        <div className="profile-nav">
          <div className="profile-nav-content">
            <div className="user-avatar">
              <img src="/dist/img/avatar-placeholder.jpg" alt="User avatar" />
            </div>

            <ul className="profile-nav-items">
              <NavTab title="Twats" count={8494} isActive />
              <NavTab title="Following" count={4954} />
              <NavTab title="Followers" count={345} />
              <NavTab title="Likes" count={54365} />
            </ul>

            <div className="twat-button">
              Follow
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            Profile info here...
          </div>
          <Trough />
          <Trends />
        </div>
      </div>
    );
  }
}

const NavTab = ({ title, count, isActive }) => (
  <li className={classNames({ isActive })}>
    <span>{title}</span><br />
    <span>{count}</span>
  </li>
);

module.exports = UserPage;
