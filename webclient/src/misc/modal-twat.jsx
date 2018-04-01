import * as React from 'react';
import moment from 'moment';
import axios from 'axios';

import './modal-twat.scss';

class ModalTwat extends React.Component {
  constructor() {
    super();
    this.state = { isLoading: true, twat: null };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    const { twatId } = this.props.match.params;
    axios.get(`/api/twats/${twatId}`)
      .then((res) => {
        this.setState({ isLoading: false, twat: res.data.twat });
      })
      .catch(err => console.error(`Error getting Twat info: ${err}`));
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="modal-twat-content-wrapper">
          <div className="modal-twat-loading-spinner">
            <img src="/dist/img/loading.gif" alt="Loading..." />
          </div>
        </div>
      );
    }

    const { twat } = this.state;
    return (
      <div className="modal-twat-content-wrapper">
        <div className="main-content-container">
          <div className="account-info">
            <div>
              <i className="material-icons user-icon">face</i>
              <div>
                <div className="display-name">{twat.user.displayName}</div>
                <div className="username">@{twat.user.username}</div>
              </div>
            </div>
            <div>
              <div className="follow-button">Follow</div>
              <i className="material-icons menu-button">expand_more</i>
            </div>
          </div>

          <div className="twat-content">
            {twat.twatText}
          </div>

          <div className="datetime">
            {moment(twat.timestamp).format('h:mm - D MMM YYYY')}
          </div>

          <div className="options-bar">
            <span><i className="material-icons">reply</i>{twat.replies.length}</span>
            <span><i className="material-icons">autorenew</i>{twat.meta.retwats}</span>
            <span><i className="material-icons">favorite_border</i>{twat.meta.likes}</span>
            <span><i className="material-icons">message</i></span>
          </div>
        </div>

        <div className="inline-reply-editor">
          <i className="material-icons user-icon">face</i>
          <input type="text" />
          <div className="twat-button">Twat</div>
        </div>

        {/* replies go here */}
      </div>
    );
  }
}

export default ModalTwat;
