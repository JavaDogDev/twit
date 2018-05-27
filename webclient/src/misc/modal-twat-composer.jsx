import * as React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-router-modal';

// import { refreshTroughAsync } from '../action-creators/trough-actions';
import './modal-twat-composer.scss';

const ModalTwatComposer = ({ visible, hideModalTwatComposer }) => {
  if (visible) {
    return (
      <Modal className="modal-twat-composer" onBackdropClick={hideModalTwatComposer}>
        <div className="title"><h3>Compose new Twat</h3></div>
        <div className="contents">
          <i className="material-icons">face</i>
          <div className="contents-right-column">
            <textarea />
            <div className="twat-button">Twat</div>
          </div>
        </div>
      </Modal>
    );
  }

  return null;
};

export default connect()(ModalTwatComposer);
