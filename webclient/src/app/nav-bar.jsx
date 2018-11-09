import * as React from 'react';
import classNames from 'classnames';
import { Link, matchPath, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { updateCurrentUserAsync } from '../action-creators/global-actions';
import NavBarProfileDropdown from '../misc/nav-bar-profile-dropdown';
import './nav-bar.scss';

/** To keep track of which NavButton to highlight as active */
const routes = {
  notifications: '/notifications',
  messages: '/messages',
  home: '/',
};

class NavBar extends React.Component {
  static isPathActive(path, current) {
    return matchPath(current, { path, exact: true }) !== null;
  }

  constructor() {
    super();
    this.state = { settingsDropdownOpen: false };

    this.onOpenDropdown = this.onOpenDropdown.bind(this);
    this.onCloseDropdown = this.onCloseDropdown.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    /*
    * Doing this here so that current user info gets updated in Redux regardless
    * of which react-router path the (now-authenticated) user entered from.
    */
    dispatch(updateCurrentUserAsync());
  }

  onOpenDropdown() {
    this.setState({ settingsDropdownOpen: true });
  }

  onCloseDropdown() {
    this.setState({ settingsDropdownOpen: false });
  }

  render() {
    const { location, showModalTwatComposer } = this.props;
    const { settingsDropdownOpen } = this.state;
    const path = location.pathname;

    return (
      <header>
        <div className="nav-buttons">
          <NavButton
            linkPath={routes.home}
            active={NavBar.isPathActive(routes.home, path)}
            iconName="home"
            buttonText="Home"
          />
          <NavButton
            linkPath={routes.notifications}
            active={NavBar.isPathActive(routes.notifications, path)}
            iconName="notifications"
            buttonText="Notifications"
          />
          <NavButton
            linkPath={routes.messages}
            active={NavBar.isPathActive(routes.messages, path)}
            iconName="email"
            buttonText="Messages"
          />

          <SearchBox />
          <SettingsMenu
            settingsDropdownOpen={settingsDropdownOpen}
            onOpenDropdown={this.onOpenDropdown}
            onCloseDropdown={this.onCloseDropdown}
          />
          <div
            className="twat-button"
            role="button"
            tabIndex={0}
            onClick={showModalTwatComposer}
          >
            Twat
          </div>
        </div>
      </header>
    );
  }
}

const NavButton = ({
  linkPath, iconName, buttonText, active,
}) => (
  <Link to={linkPath} className={classNames('nav-button', { active })}>
    <i className="material-icons">{iconName}</i>
    {buttonText}
  </Link>
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

export default connect()(withRouter(NavBar));
