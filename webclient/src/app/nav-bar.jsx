import * as React from 'react';
import classNames from 'classnames';

import NavBarProfileDropdown from '../misc/nav-bar-profile-dropdown';
import './nav-bar.scss';

class NavBar extends React.Component {
  constructor() {
    super();
    this.state = { settingsDropdownOpen: false };

    this.onOpenDropdown = this.onOpenDropdown.bind(this);
    this.onCloseDropdown = this.onCloseDropdown.bind(this);
  }

  onOpenDropdown() {
    this.setState({ settingsDropdownOpen: true });
  }

  onCloseDropdown() {
    this.setState({ settingsDropdownOpen: false });
  }

  render() {
    return (
      <header>
        <div className="nav-buttons">
          <NavButton active iconName="home" buttonText="Home" />
          <NavButton iconName="notifications" buttonText="Notifications" />
          <NavButton iconName="email" buttonText="Messages" />

          <SearchBox />
          <SettingsMenu
            settingsDropdownOpen={this.state.settingsDropdownOpen}
            onOpenDropdown={this.onOpenDropdown}
            onCloseDropdown={this.onCloseDropdown}
          />
          <div
            className="twat-button"
            role="button"
            tabIndex={0}
            onClick={this.props.showModalTwatComposer}
          >
            Twat
          </div>
        </div>
      </header>
    );
  }
}

const NavButton = ({ iconName, buttonText, active }) => (
  <div className={classNames('nav-button', { active })}>
    <i className="material-icons">{iconName}</i> {buttonText}
  </div>
);

const SearchBox = () => (
  <div className="search-box">
    <input type="text" placeholder="Search..." />
  </div>
);

const SettingsMenu = ({ settingsDropdownOpen, onOpenDropdown, onCloseDropdown }) => (
  <div className="settings-menu" onClick={onOpenDropdown} role="button" tabIndex={0}>
    <i className="material-icons">face</i>
    {settingsDropdownOpen
      ? <NavBarProfileDropdown onCloseDropdown={onCloseDropdown} />
      : null}
  </div>
);

export default NavBar;
