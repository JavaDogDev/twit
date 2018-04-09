import * as React from 'react';
import axios from 'axios';

import ListTwat from '../misc/list-twat';
import TroughLoadingSpinner from './trough-loading-spinner';
import TwatComposerInline from './twat-composer-inline';
import './trough.scss';

class Trough extends React.Component {
  constructor() {
    super();
    this.state = { showSpinner: true, twats: [] };
    this.refreshTrough = this.refreshTrough.bind(this);
  }

  componentDidMount() {
    this.refreshTrough();
  }

  refreshTrough() {
    axios.get('/api/twats/trough')
      .then(res => this.setState({
        showSpinner: false,
        twats: res.data.twats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
      }))
      .catch(err => console.log(`Error getting Twats from followed users: ${err}`));
  }

  render() {
    return (
      <div className="trough">
        <TwatComposerInline refreshTrough={this.refreshTrough} />
        {this.state.showSpinner ? <TroughLoadingSpinner /> : null}
        {this.state.twats.map(twat => <ListTwat twat={twat} key={twat._id} />)}
      </div>
    );
  }
}

export default Trough;
