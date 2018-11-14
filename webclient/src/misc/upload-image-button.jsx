import axios from 'axios';
import * as React from 'react';
import { connect } from 'react-redux';

import { showImageUploadModal, setImageAttachmentId } from '../action-creators/global-actions';

import './upload-image-button.scss';

function mapStateToProps(state) {
  return {
    imageAttachmentId: state.global.imageAttachmentId,
  };
}

class UploadImageButton extends React.Component {
  constructor() {
    super();
    this.showImageUploadModal = this.showImageUploadModal.bind(this);
    this.cancelImageAttachment = this.cancelImageAttachment.bind(this);
  }

  showImageUploadModal() {
    const { dispatch } = this.props;
    dispatch(showImageUploadModal());
  }

  cancelImageAttachment() {
    const { dispatch, imageAttachmentId } = this.props;

    axios.delete(`/api/uploads/image-attachment/${imageAttachmentId}`)
      .then(dispatch(setImageAttachmentId(null)))
      .catch(e => console.error(`Couldn't delete image attachment:\n\t${e}`));
  }

  render() {
    const { imageAttachmentId } = this.props;

    if (imageAttachmentId !== null) {
      return (
        <span className="image-attachment" role="button" tabIndex="0" onClick={this.cancelImageAttachment}>
          <i className="material-icons">highlight_off</i>
          +4 images
        </span>
      );
    }

    return (
      <span className="📷" role="button" onClick={this.showImageUploadModal} tabIndex="0">
        <i className="material-icons">image</i>
      </span>
    );
  }
}

export default connect(mapStateToProps)(UploadImageButton);
