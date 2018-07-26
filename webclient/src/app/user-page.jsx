import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Trough from '../trough/trough';
import Trends from '../misc/trends';
import InlineLoadingSpinner from '../misc/inline-loading-spinner';
import { setUserPageLoading, updateUserPageAsync } from '../action-creators/user-page-actions';
import './user-page.scss';

function mapStateToProps(state) {
  return {
    user: state.userPage.user,
    twats: state.userPage.twats,
    isLoading: state.userPage.isLoading,
  };
}

class UserPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(setUserPageLoading());

    const { username } = this.props.match.params;
    this.props.dispatch(updateUserPageAsync(username));
  }

  render() {
    const { user, twats, isLoading } = this.props;

    if (isLoading) {
      return (
        <div className="user-page">
          <InlineLoadingSpinner />
        </div>
      );
    }

    // Add user prop to each Twat for compatibility with Trough
    const userifiedTwats = [];
    twats.forEach((twat) => {
      const twatClone = { ...twat };
      twatClone.user = user;
      userifiedTwats.push(twatClone);
    });

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

        <main>
          <div className="profile-info">
            <div className="display-name">{user.displayName}</div>
            <div className="username">@{user.username}</div>
            <div className="bio">{user.bio}</div>
          </div>

          <Trough twats={userifiedTwats} isLoading={isLoading} />

          <Trends />
        </main>
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

export default connect(mapStateToProps)(UserPage);
