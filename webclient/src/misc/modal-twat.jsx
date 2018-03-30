import * as React from 'react';
import { ModalRoute } from 'react-router-modal';

import ListTwat from './list-twat';
import './modal-twat.scss';

const ModalTwat = () => (
  <ModalRoute
    path="/PATH-FOR-DEV-ONLY"
    parentPath="/"
    className="react-router-modal__modal modal-twat"
  >
    <div className="modal-twat-content-wrapper">
      <div className="main-content-container">
        <div className="account-info">
          <div>
            <i className="material-icons user-icon">face</i>
            <div>
              <div className="display-name">Display Name</div>
              <div className="username">@username</div>
            </div>
          </div>
          <div>
            <div className="follow-button">Follow</div>
            <i className="material-icons menu-button">expand_more</i>
          </div>
        </div>

        <div className="twat-content">
          Filler text here hello
        </div>

        <div className="datetime">
          13:37 - 20 April 2017
        </div>

        <div className="options-bar">
          <span><i className="material-icons">reply</i>13</span>
          <span><i className="material-icons">autorenew</i>37</span>
          <span><i className="material-icons">favorite_border</i>69</span>
          <span><i className="material-icons">message</i></span>
        </div>
      </div>

      <div className="inline-reply-editor">
        <i className="material-icons user-icon">face</i>
        <input type="text" />
        <div className="twat-button">Twat</div>
      </div>

      {/* twats go here */}
    </div>
  </ModalRoute>
);

export default ModalTwat;
