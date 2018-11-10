import * as React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal } from 'react-router-modal';

import { refreshDashboardTroughAsync } from '../action-creators/dashboard-actions';
import UploadImageButton from './upload-image-button';
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
    const { dispatch, hideModalTwatComposer } = this.props;
    const { twatText } = this.state;
    axios.post('/api/twats', { twatText })
      .then(() => { this.setState({ twatText: '' }); })
      .then(dispatch(refreshDashboardTroughAsync()))
      .then(() => hideModalTwatComposer())
      .catch(err => console.error(`Error submitting new Twat: ${err}`));
  }

  render() {
    const { visible, hideModalTwatComposer } = this.props;
    const { twatText } = this.state;

    if (visible) {
      return (
        <Modal className="modal-twat-composer" onBackdropClick={hideModalTwatComposer}>
          <div className="title"><h3>Compose new Twat</h3></div>
          <i className="material-icons avatar">face</i>
          <UploadImageButton />
          <textarea value={twatText} onChange={this.handleTextInput} />
          <button type="button" className="twat-button" onClick={this.submitNewTwat}>Twat</button>
        </Modal>
      );
    }

    return null;
  }
}

export default connect()(ModalTwatComposer);
