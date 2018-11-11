import * as React from 'react';
import { connect } from 'react-redux';

import { showImageUploadModal } from '../action-creators/global-actions';

import './upload-image-button.scss';

class UploadImageButton extends React.Component {
  constructor() {
    super();
    this.showImageUploadModal = this.showImageUploadModal.bind(this);
  }

  showImageUploadModal() {
    const { dispatch } = this.props;
    dispatch(showImageUploadModal());
  }

  render() {
    return (
      <span className="📷" role="button" onClick={this.showImageUploadModal} tabIndex="0">
        <i className="material-icons">image</i>
      </span>
    );
  }
}

export default connect()(UploadImageButton);
