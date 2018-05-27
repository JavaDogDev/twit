import * as React from 'react';
import { connect } from 'react-redux';

import { refreshTroughAsync } from '../action-creators/trough-actions';
import ListTwat from '../misc/list-twat';
import TroughLoadingSpinner from './trough-loading-spinner';
import TwatComposerInline from './twat-composer-inline';
import './trough.scss';

function mapStateToProps(state) {
  return { twats: state.trough.twats };
}

class Trough extends React.Component {
  constructor() {
    super();
    this.state = { showSpinner: true };
  }

  componentDidMount() {
    this.props.dispatch(refreshTroughAsync())
      .then(() => this.setState({ showSpinner: false }));
  }

  render() {
    return (
      <div className="trough">
        <TwatComposerInline />
        {this.state.showSpinner ? <TroughLoadingSpinner /> : null}
        {this.props.twats.map(twat => <ListTwat twat={twat} key={twat._id} />)}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Trough);
