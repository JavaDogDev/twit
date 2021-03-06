import * as React from 'react';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';

import ListTwat from './list-twat';
import UploadImageButton from './upload-image-button';
import InlineLoadingSpinner from './inline-loading-spinner';
import { setImageAttachmentId } from '../action-creators/global-actions';
import './modal-twat.scss';

function mapStateToProps(state) {
  return {
    imageAttachmentId: state.global.imageAttachmentId,
  };
}

class ModalTwat extends React.Component {
  constructor() {
    super();
    this.state = {
      mainTwatLoading: true,
      repliesLoading: true,
      twat: null,
      replies: [],
      replyEditorText: '',
    };

    this.handleReplyInput = this.handleReplyInput.bind(this);
    this.refreshReplies = this.refreshReplies.bind(this);
    this.submitReply = this.submitReply.bind(this);
  }

  componentWillMount() {
    const { match } = this.props;

    this.setState({
      mainTwatLoading: true,
      repliesLoading: true,
      replies: [],
      replyEditorText: '',
      imageUrls: [],
    });

    const { twatId } = match.params;
    axios.get(`/api/twats/${twatId}`)
      .then((res) => {
        this.setState({ mainTwatLoading: false, twat: res.data.twat });
        return res.data.twat;
      })
      .then(async (twat) => {
        if (twat.images) {
          const res = await axios.get(`/api/uploads/image-attachment/${twat.images}`);
          this.setState({ imageUrls: res.data });
        }
      })
      .catch(err => console.error(`Error getting Twat info: ${err}`));
  }

  componentDidMount() {
    this.refreshReplies();
  }

  refreshReplies() {
    const { match } = this.props;

    this.setState({ repliesLoading: true });

    const { twatId } = match.params;
    axios.get(`/api/twats/replies/${twatId}`)
      .then((res) => {
        this.setState({ repliesLoading: false, replies: res.data });
      })
      .catch(err => console.error(`Error getting Twat replies: ${err}`));
  }

  handleReplyInput(event) {
    this.setState({ replyEditorText: event.target.value });
  }

  submitReply() {
    const { dispatch, imageAttachmentId } = this.props;
    const { replyEditorText, twat } = this.state;

    const postData = { twatText: replyEditorText, replyingTo: twat._id };
    if (imageAttachmentId !== null) {
      postData.imageAttachmentId = imageAttachmentId;
    }

    axios.post('/api/twats', postData)
      .then(() => this.setState({ replyEditorText: '' }))
      .then(dispatch(setImageAttachmentId(null)))
      .then(this.refreshReplies)
      .catch(err => console.error(`Error submitting reply: ${err}`));
  }

  render() {
    const { mainTwatLoading, imageUrls } = this.state;
    if (mainTwatLoading) {
      return (
        <div className="modal-twat-content-wrapper">
          <div className="modal-twat-loading-spinner">
            <img src="/dist/img/loading.gif" alt="Loading..." />
          </div>
        </div>
      );
    }

    const {
      twat,
      replies,
      replyEditorText,
      repliesLoading,
    } = this.state;
    return (
      <div className="modal-twat-content-wrapper">
        <div className="main-content-container">
          <div className="account-info">
            <div>
              <i className="material-icons user-icon">face</i>
              <div>
                <div className="display-name">{twat.user.displayName}</div>
                <div className="username">{`@${twat.user.username}`}</div>
              </div>
            </div>
            <div>
              <div className="follow-button">Follow</div>
              <i className="material-icons menu-button">expand_more</i>
            </div>
          </div>

          <div className="twat-content">
            {twat.twatText}

            {imageUrls.length === 4 ? (
              <div className="image-attachments">
                <div>
                  <img src={imageUrls[0]} alt="ImageAttachment" key={imageUrls[0] + 0} />
                  <img src={imageUrls[1]} alt="ImageAttachment" key={imageUrls[1] + 1} />
                </div>
                <div>
                  <img src={imageUrls[2]} alt="ImageAttachment" key={imageUrls[2] + 2} />
                  <img src={imageUrls[3]} alt="ImageAttachment" key={imageUrls[3] + 3} />
                </div>
              </div>
            ) : null}
          </div>

          <div className="datetime">
            {moment(twat.timestamp).format('h:mma - D MMM YYYY')}
          </div>

          <div className="options-bar">
            <span>
              <i className="material-icons">reply</i>
              {replies.length}
            </span>
            <span>
              <i className="material-icons">autorenew</i>
              {twat.meta.retwats}
            </span>
            <span>
              <i className="material-icons">favorite_border</i>
              {twat.meta.likes}
            </span>
            <span><i className="material-icons">message</i></span>
          </div>
        </div>

        {typeof twat.replyingTo !== 'string' ? (
          <div className="inline-reply-editor">
            <i className="material-icons user-icon">face</i>
            <input
              type="text"
              value={replyEditorText}
              onChange={this.handleReplyInput}
            />
            <UploadImageButton />
            <button
              type="button"
              className="twat-button"
              onClick={this.submitReply}
              enabled={(replyEditorText.length > 0).toString()}
            >
              Twat
            </button>
          </div>
        ) : null}

        <div>
          {repliesLoading
            ? <InlineLoadingSpinner />
            : replies.map(reply => <ListTwat initialTwat={reply} key={reply._id} hideReplyIcon />)}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ModalTwat);
