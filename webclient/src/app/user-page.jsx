import * as React from 'react';

import NavBar from './nav-bar';
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
        User page yay
      </div>
    );
  }
}

module.exports = UserPage;
