import * as React from 'react';

import './user-page.scss';

class UserPage extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      userTwats: null,
      userInfoLoading: true,
      userTwatsLoading: true,
    };
  }

  render() {
    return (
      <div className="user-page">
        <img className="header-image" src="/dist/img/header-placeholder.jpg" alt="Profile header" />
        <div className="profile-nav">
          <div className="profile-nav-content">
            <ul className="profile-nav-items">
              <li>
                <span>Twats</span><br />
                <span>3594</span>
              </li>
              <li>
                <span>Following</span><br />
                <span>4954</span>
              </li>
              <li>
                <span>Followers</span><br />
                <span>345</span>
              </li>
              <li>
                <span>Likes</span><br />
                <span>54365</span>
              </li>
            </ul>
            <div className="twat-button">
              Follow
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = UserPage;
