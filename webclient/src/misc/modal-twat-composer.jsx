import * as React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal } from 'react-router-modal';

import { hideModalTwatComposer, setImageAttachmentId } from '../action-creators/global-actions';
import { refreshDashboardTroughAsync } from '../action-creators/dashboard-actions';
import UploadImageButton from './upload-image-button';
import './modal-twat-composer.scss';

function mapStateToProps(state) {
  return {
    imageAttachmentId: state.global.imageAttachmentId,
  };
}

class ModalTwatComposer extends React.Component {
  constructor() {
    super();
    this.state = { twatText: '' };

    this.handleTextInput = this.handleTextInput.bind(this);
    this.submitNewTwat = this.submitNewTwat.bind(this);
    this.hideModalTwatComposer = this.hideModalTwatComposer.bind(this);
  }

  handleTextInput(event) {
    this.setState({ twatText: event.target.value });
  }

  submitNewTwat() {
    const { dispatch, imageAttachmentId } = this.props;
    const { twatText } = this.state;

    const postData = { twatText };
    if (imageAttachmentId !== null) {
      postData.imageAttachmentId = imageAttachmentId;
    }

    axios.post('/api/twats', postData)
      .then(() => { this.setState({ twatText: '' }); })
      .then(dispatch(setImageAttachmentId(null)))
      .then(dispatch(refreshDashboardTroughAsync()))
      .then(() => this.hideModalTwatComposer())
      .catch(err => console.error(`Error submitting new Twat: ${err}`));
  }

  hideModalTwatComposer() {
    const { dispatch } = this.props;
    dispatch(hideModalTwatComposer());
  }

  render() {
    const { visible } = this.props;
    const { twatText } = this.state;

    if (visible) {
      return (
        <Modal className="modal-twat-composer" onBackdropClick={this.hideModalTwatComposer}>
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

export default connect(mapStateToProps)(ModalTwatComposer);
