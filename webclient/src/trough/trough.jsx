import * as React from 'react';
import axios from 'axios';

import ListTwat from '../misc/list-twat';
import TroughLoadingSpinner from './trough-loading-spinner';
import './trough.scss';

class Trough extends React.Component {
  constructor() {
    super();
    this.state = { showSpinner: true, twats: [], composerText: '' };
    this.handleComposerInput = this.handleComposerInput.bind(this);
    this.submitNewTwat = this.submitNewTwat.bind(this);
    this.refreshTrough = this.refreshTrough.bind(this);
  }

  componentDidMount() {
    this.refreshTrough();
  }

  refreshTrough() {
    axios.get('/api/twats/trough')
      .then(res => this.setState({
        showSpinner: false,
        twats: res.data.twats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        composerText: '',
      }))
      .catch(err => console.log(`Error getting Twats from followed users: ${err}`));
  }

  submitNewTwat() {
    const twatText = this.state.composerText;
    axios.post('/api/twats', { twatText })
      .then(this.refreshTrough)
      .catch(err => console.error(`Error submitting new Twat: ${err}`));
  }

  handleComposerInput(event) {
    this.setState({ composerText: event.target.value });
  }

  render() {
    return (
      <div className="trough">
        <TwatComposerInline
          submitNewTwat={this.submitNewTwat}
          handleComposerInput={this.handleComposerInput}
        />
        {this.state.showSpinner ? <TroughLoadingSpinner /> : null}
        {this.state.twats.map(twat => <ListTwat twat={twat} key={twat._id} />)}
      </div>
    );
  }
}

const TwatComposerInline = ({ submitNewTwat, handleComposerInput }) => (
  <div className="twat-composer-inline">
    <div className="user-icon">
      <i className="material-icons">face</i>
    </div>
    <input
      type="text"
      placeholder="Don't think, just type."
      onChange={handleComposerInput}
    />
    <button
      className="twat-button"
      tabIndex={0}
      onClick={submitNewTwat}
    >
      Twat
    </button>
  </div>
);

export default Trough;
