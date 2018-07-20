import * as React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { refreshDashboardTroughAsync } from '../action-creators/dashboard-actions';
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
    const twatText = this.state.composerText;
    axios.post('/api/twats', { twatText })
      .then(() => { this.setState({ composerText: '' }); })
      .then(this.props.dispatch(refreshDashboardTroughAsync()))
      .catch(err => console.error(`Error submitting new Twat: ${err}`));
  }

  render() {
    return (
      <div className="twat-composer-inline">
        <div className="user-icon">
          <i className="material-icons">face</i>
        </div>
        <input
          type="text"
          value={this.state.composerText}
          placeholder="Don't think, just type."
          onChange={this.handleComposerInput}
        />
        <button
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
