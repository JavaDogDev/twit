import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { refreshDashboardTroughAsync } from '../action-creators/dashboard-actions';
import UploadImageButton from '../misc/upload-image-button';
import './twat-composer-inline.scss';

class TwatComposerInline extends React.Component {
  constructor() {
    super();
    this.state = { composerText: '' };
    this.handleComposerInput = this.handleComposerInput.bind(this);
    this.submitNewTwat = this.submitNewTwat.bind(this);
  }

  handleComposerInput(event) {
    this.setState({ composerText: event.target.value });
  }

  submitNewTwat() {
    const { dispatch, composerText } = this.state;
    const twatText = composerText;
    axios.post('/api/twats', { twatText })
      .then(() => { this.setState({ composerText: '' }); })
      .then(dispatch(refreshDashboardTroughAsync()))
      .catch(err => console.error(`Error submitting new Twat: ${err}`));
  }

  render() {
    const { composerText } = this.state;
    return (
      <div className="twat-composer-inline">
        <div className="user-icon">
          <i className="material-icons">face</i>
        </div>
        <input
          type="text"
          value={composerText}
          placeholder="Don't think, just type."
          onChange={this.handleComposerInput}
        />
        <UploadImageButton />
        <button
          type="button"
          className="twat-button"
          tabIndex={0}
          onClick={this.submitNewTwat}
        >
          Twat
        </button>
      </div>
    );
  }
}

export default connect()(TwatComposerInline);
