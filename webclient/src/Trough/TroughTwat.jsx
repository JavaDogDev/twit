import * as React from 'react';

import './TroughTwat.scss';

const TroughTwat = ({ twat }) => (
  <div className="trough-twat">
    <div className="user-icon">
      <i className="material-icons">face</i>
    </div>

    <div className="twat-content">
      <div className="heading">
        <span className="display-name">{twat.user.displayName}</span>
        <span>{twat.user.username}</span>
        &nbsp; &middot; &nbsp;
        <span>2h</span>
        <div className="menu-button">
          <i className="material-icons">expand_more</i>
        </div>
      </div>
      <p className="twat-text">{twat.twatText}</p>
      <div className="options-bar">
        <span><i className="material-icons">reply</i>13</span>
        <span><i className="material-icons">autorenew</i>37</span>
        <span><i className="material-icons">favorite_border</i>69</span>
        <span><i className="material-icons">message</i></span>
      </div>
    </div>
  </div>
);

export default TroughTwat;
