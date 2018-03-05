import * as React from 'react';
import classNames from 'classnames';

import TwatButton from '../misc/twat-button';
import './nav-bar.scss';

const NavBar = () => (
  <header>
    <div className="nav-buttons">
      <NavButton active iconName="home" buttonText="Home" />
      <NavButton iconName="notifications" buttonText="Notifications" />
      <NavButton iconName="email" buttonText="Messages" />

      <TwatButton />
    </div>
  </header>
);

const NavButton = ({ iconName, buttonText, active }) => (
  <div className={classNames('nav-button', { active })}>
    <i className="material-icons">{iconName}</i> {buttonText}
  </div>
);

export default NavBar;
