import * as React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal } from 'react-router-modal';

import { refreshDashboardTroughAsync } from '../action-creators/dashboard-actions';
import './modal-twat-composer.scss';

class ModalTwatComposer extends React.Component {
  constructor() {
    super();
    this.state = { twatText: '' };

    this.handleTextInput = this.handleTextInput.bind(this);
    this.submitNewTwat = this.submitNewTwat.bind(this);
  }

  handleTextInput(event) {
    this.setState({ twatText: event.target.value });
  }

  submitNewTwat() {
    axios.post('/api/twats', { twatText: this.state.twatText })
      .then(() => { this.setState({ twatText: '' }); })
      .then(this.props.dispatch(refreshDashboardTroughAsync()))
      .then(() => this.props.hideModalTwatComposer())
      .catch(err => console.error(`Error submitting new Twat: ${err}`));
  }

  render() {
    const { visible, hideModalTwatComposer } = this.props;

    if (visible) {
      return (
        <Modal className="modal-twat-composer" onBackdropClick={hideModalTwatComposer}>
          <div className="title"><h3>Compose new Twat</h3></div>
          <div className="contents">
            <i className="material-icons">face</i>
            <div className="contents-right-column">
              <textarea value={this.state.twatText} onChange={this.handleTextInput} />
              <button className="twat-button" onClick={this.submitNewTwat}>Twat</button>
            </div>
          </div>
        </Modal>
      );
    }

    return null;
  }
}

export default connect()(ModalTwatComposer);
