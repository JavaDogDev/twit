/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal } from 'react-router-modal';

import InlineLoadingSpinner from './inline-loading-spinner';
import { hideImageUploadModal, setImageAttachmentId } from '../action-creators/global-actions';

import './upload-image-modal.scss';

class ImageChoice extends React.Component {
  constructor() {
    super();
    this.state = { previewData: null };
    this.onSelectFile = this.onSelectFile.bind(this);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const { index, onSelectImage } = this.props;

      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        this.setState({ previewData: e.target.result });
      });
      reader.readAsDataURL(event.target.files[0]);

      // Pass image File back up to parent
      onSelectImage(index, event.target.files[0]);
    }
  }

  render() {
    const { index } = this.props;
    const { previewData } = this.state;

    return (
      <div className="image-choice">
        {previewData !== null
          ? <img src={previewData} alt="Preview" />
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
  static allImagesPresent(images) {
    let allImages = true;
    for (let i = 0; i < 4; i++) {
      if (!images[i] || !(images[i] instanceof File)) {
        allImages = false;
        break;
      }
    }
    return allImages;
  }

  constructor() {
    super();
    this.state = {
      images: [],
      canUpload: false,
      uploading: false,
      percent: 0,
    };
    this.onSelectImage = this.onSelectImage.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.hideImageUploadModal = this.hideImageUploadModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Reset state when this modal is closing
    if (!nextProps.visible) {
      this.setState({
        images: [],
        canUpload: false,
        uploading: false,
        percent: 0,
      });
    }
  }

  onSelectImage(index, file) {
    this.setState((prevState) => {
      const imagesClone = [...prevState.images];
      imagesClone[index] = file;
      return { images: imagesClone, canUpload: UploadImageModal.allImagesPresent(imagesClone) };
    });
  }

  onUpload() {
    this.setState({ uploading: true });

    const { dispatch } = this.props;
    const { images } = this.state;
    const uploadData = new FormData();
    images.forEach(i => uploadData.append('images', i));

    const config = {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        this.setState({ percent });
      },
    };

    axios
      .post('/api/uploads/four-images', uploadData, config)
      .then((res) => {
        dispatch(setImageAttachmentId(res.data.imageAttachment));
        dispatch(hideImageUploadModal());
      })
      .catch(e => console.error(`Problem while uploading images:\n\t${e}`));
  }

  hideImageUploadModal() {
    const { dispatch } = this.props;
    dispatch(hideImageUploadModal());
  }

  render() {
    const { visible } = this.props;
    const { canUpload, uploading, percent } = this.state;

    if (visible) {
      return (
        <Modal className="upload-image-modal" onBackdropClick={this.hideImageUploadModal}>
          <div className="title"><h3>Exactly 4 images, please</h3></div>

          {!uploading ? (
            <div className="file-choosers">
              <div className="file-chooser-row">
                <ImageChoice index={0} onSelectImage={this.onSelectImage} />
                <ImageChoice index={1} onSelectImage={this.onSelectImage} />
              </div>
              <div className="file-chooser-row">
                <ImageChoice index={2} onSelectImage={this.onSelectImage} />
                <ImageChoice index={3} onSelectImage={this.onSelectImage} />
              </div>
            </div>
          ) : (
            <div className="loading-screen">
              <InlineLoadingSpinner />
              {`${percent}%`}
            </div>
          )}

          <button
            type="button"
            disabled={!canUpload || uploading}
            onClick={this.onUpload}
            className="twat-button upload-button"
          >
            Upload
          </button>
        </Modal>
      );
    }

    return null;
  }
}

export default connect()(UploadImageModal);
