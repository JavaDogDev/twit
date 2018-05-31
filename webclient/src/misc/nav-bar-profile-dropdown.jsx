import * as React from 'react';
import enhanceWithClickOutside from 'react-click-outside';

import './nav-bar-profile-dropdown.scss';

function handleLogout() {
  window.location = '/api/login/logout';
}

class NavBarProfileDropdown extends React.Component {
  constructor() {
    super();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside() {
    this.props.onCloseDropdown();
  }

  render() {
    return (
      <ul className="nav-bar-profile-dropdown">
        <li onClick={handleLogout} role="button">Log out</li>
      </ul>
    );
  }
}

export default enhanceWithClickOutside(NavBarProfileDropdown);
