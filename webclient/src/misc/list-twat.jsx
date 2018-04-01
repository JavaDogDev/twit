import * as React from 'react';
import { Link } from 'react-router-dom';

import timeSince from './time-since';
import './list-twat.scss';

const ListTwat = ({ twat }) => (
  <div className="list-twat">
    <div className="user-icon">
      <i className="material-icons">face</i>
    </div>

    <div className="list-twat-content">
      <div className="heading">
        <span className="user-link">
          <span className="display-name">{twat.user.displayName}</span>
          <span>@{twat.user.username}</span>
        </span>
        &nbsp; &middot; &nbsp;
        <Link to={`/twat/${twat._id}`} style={{ textDecoration: 'none' }}>
          <span className="relative-timestamp">{timeSince(new Date(twat.timestamp))}</span>
        </Link>
        <div className="menu-button">
          <i className="material-icons">expand_more</i>
        </div>
      </div>
      <p className="twat-text">{twat.twatText}</p>
      <div className="options-bar">
        <span><i className="material-icons">reply</i>0</span>
        <span><i className="material-icons">autorenew</i>{twat.meta.retwats}</span>
        <span><i className="material-icons">favorite_border</i>{twat.meta.likes}</span>
        <span><i className="material-icons">message</i></span>
      </div>
    </div>
  </div>
);

export default ListTwat;
