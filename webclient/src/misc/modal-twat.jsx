import * as React from 'react';
import moment from 'moment';
import axios from 'axios';

import ListTwat from './list-twat';
import UploadImageButton from './upload-image-button';
import InlineLoadingSpinner from './inline-loading-spinner';
import './modal-twat.scss';

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
    });

    const { twatId } = match.params;
    axios.get(`/api/twats/${twatId}`)
      .then((res) => {
        this.setState({ mainTwatLoading: false, twat: res.data.twat });
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
    const { replyEditorText, twat } = this.state;

    axios.post('/api/twats', { twatText: replyEditorText, replyingTo: twat._id })
      .then(() => this.setState({ replyEditorText: '' }))
      .then(this.refreshReplies)
      .catch(err => console.error(`Error submitting reply: ${err}`));
  }

  render() {
    const { mainTwatLoading } = this.state;
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

export default ModalTwat;
