/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal } from 'react-router-modal';

import { hideImageUploadModal } from '../action-creators/global-actions';

import './upload-image-modal.scss';

class ImageChoice extends React.Component {
  constructor() {
    super();
    this.state = { imageData: null };
    this.onSelectFile = this.onSelectFile.bind(this);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.addEventListener('load', (e) => {
        this.setState({ imageData: e.target.result });
      });

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  render() {
    const { index } = this.props;
    const { imageData } = this.state;

    return (
      <div className="image-choice">
        {imageData !== null
          ? <img src={imageData} alt="Preview" />
          : null}

        {/* eslint-disable-next-line */}
        <label htmlFor={`image-choice-${index}`} className="custom-file-upload">
          <i className="material-icons">cloud_upload</i>
          <br />
          <br />
          Choose Image...
        </label>
        <input id={`image-choice-${index}`} type="file" accept="image/*" onChange={this.onSelectFile} />
      </div>
    );
  }
}

class UploadImageModal extends React.Component {
  constructor() {
    super();
    this.state = { images: [] };
    this.hideImageUploadModal = this.hideImageUploadModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // TODO - if hiding the dialog, be sure to clear out any selected images
  }

  hideImageUploadModal() {
    const { dispatch } = this.props;
    dispatch(hideImageUploadModal());
  }

  render() {
    const { visible } = this.props;
    const { imagePath } = this.state;

    if (visible) {
      return (
        <Modal className="upload-image-modal" onBackdropClick={this.hideImageUploadModal}>
          <div className="title"><h3>Exactly 4 images, please</h3></div>

          <div className="file-choosers">
            <div className="file-chooser-row">
              <ImageChoice index={0} />
              <ImageChoice index={1} />
            </div>
            <div className="file-chooser-row">
              <ImageChoice index={2} />
              <ImageChoice index={3} />
            </div>
          </div>

          <button type="button" className="twat-button upload-button">Upload</button>
        </Modal>
      );
    }

    return null;
  }
}

export default connect()(UploadImageModal);
