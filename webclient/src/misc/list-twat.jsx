import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import timeSince from './time-since';
import './list-twat.scss';

function mapStateToProps(state) {
  return { currentUser: state.global.currentUser };
}

class ListTwat extends React.Component {
  constructor() {
    super();
    this.state = { updatedTwat: null, imageUrls: [] };

    this.setImageUrls = this.setImageUrls.bind(this);
    this.likeTwat = this.likeTwat.bind(this);
    this.unlikeTwat = this.unlikeTwat.bind(this);
  }

  componentDidMount() {
    const { initialTwat } = this.props;
    if (initialTwat.images) {
      axios.get(`/api/uploads/image-attachment/${initialTwat.images}`)
        .then(res => this.setState({ imageUrls: res.data }))
        .catch(err => console.error(`Couldn't get URLs for ImageAttachments:\n\t${err}`));
    }
  }

  setImageUrls(imageUrls) {
    this.setState({ imageUrls });
  }

  likeTwat() {
    const { initialTwat } = this.props;
    axios.post(`/api/twats/${initialTwat._id}/like`)
      .then(res => this.setState({ updatedTwat: res.data.twat }))
      .catch(e => console.error(`Error while liking Twat '${initialTwat._id}\n\t${e}'`));
  }

  unlikeTwat() {
    const { initialTwat } = this.props;
    axios.post(`/api/twats/${initialTwat._id}/unlike`)
      .then(res => this.setState({ updatedTwat: res.data.twat }))
      .catch(e => console.error(`Error while unliking Twat '${initialTwat._id}\n\t${e}'`));
  }

  render() {
    const { initialTwat, hideReplyIcon, currentUser } = this.props;
    const { updatedTwat, imageUrls } = this.state;

    /*
     * Default to the Twat data passed in as a prop, unless an updated Twat exists in component state
     * (to handle dynamic updating of Likes, etc.)
     */
    const twat = (updatedTwat === null) ? initialTwat : updatedTwat;

    const isReply = typeof twat.replyingTo === 'undefined';
    const currentUserLiked = twat.meta.likedBy.includes(currentUser.userId);

    return (
      <div className="list-twat">
        <div className="user-icon">
          <i className="material-icons">face</i>
        </div>

        <div className="list-twat-content">
          <div className="heading">
            <Link to={`/user/${twat.user.username}`} className="user-link">
              <span className="display-name">{twat.user.displayName}</span>
              <span>
                {`@${twat.user.username}`}
              </span>
            </Link>
            &nbsp; &middot; &nbsp;
            <Link to={`/twat/${twat._id}`} style={{ textDecoration: 'none' }}>
              <span className="relative-timestamp">{timeSince(new Date(twat.timestamp))}</span>
            </Link>
            <div className="menu-button">
              <i className="material-icons">expand_more</i>
            </div>
          </div>

          <p className="twat-text">{twat.twatText}</p>

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

          <div className="options-bar">
            {isReply ? (
              <span>
                <i className="material-icons">reply</i>
                {initialTwat.numReplies ? initialTwat.numReplies : ''}
              </span>
            ) : null}

            {!isReply && !hideReplyIcon ? (
              <Link to={`/twat/${twat.replyingTo}`} style={{ textDecoration: 'none' }}>
                <span title="Show thread">
                  <i className="material-icons">keyboard_arrow_up</i>
                  &nbsp;
                </span>
              </Link>
            ) : null}

            <span>
              <i className="material-icons">autorenew</i>
              {twat.meta.retwats}
            </span>

            <span onClick={currentUserLiked ? this.unlikeTwat : this.likeTwat} role="button" tabIndex="0">
              <i className="material-icons" style={currentUserLiked ? { color: '#a97781' } : null}>
                {currentUserLiked ? 'favorite' : 'favorite_border'}
              </i>
              {twat.meta.likedBy.length}
            </span>

            <span><i className="material-icons">message</i></span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ListTwat);
