import * as React from 'react';
import axios from 'axios';

import ListTwat from '../misc/list-twat';
import TroughLoadingSpinner from './trough-loading-spinner';
import './trough.scss';

class Trough extends React.Component {
  constructor() {
    super();
    this.state = { showSpinner: true, twats: [] };
  }

  componentDidMount() {
    axios.get('/api/twats/following')
      .then(res => this.setState({ showSpinner: false, twats: res.data.twats }))
      .catch(err => console.log(`Error getting Twats from followed users: ${err}`));
  }

  render() {
    return (
      <div className="trough">
        <TwitComposerInline />
        {this.state.showSpinner ? <TroughLoadingSpinner /> : null}
        {this.state.twats.map(twat => <ListTwat twat={twat} key={twat._id} />)}
      </div>
    );
  }
}

const TwitComposerInline = () => (
  <div className="twit-composer-inline">
    <div className="user-icon">
      <i className="material-icons">face</i>
    </div>
    <input type="text" placeholder="Don't think, just type." />
    <div className="twat-button">Twat</div>
  </div>
);

export default Trough;
