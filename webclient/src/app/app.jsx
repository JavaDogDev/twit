import * as React from 'react';
import { withLastLocation } from 'react-router-last-location';
import { ModalContainer, ModalRoute } from 'react-router-modal';
import 'react-router-modal/css/react-router-modal.css';
import {
  Switch,
  Route,
  withRouter,
  matchPath,
} from 'react-router-dom';

import Login from './login';
import NavBar from './nav-bar';
import UserPage from './user-page';
import Dashboard from './dashboard';
import ModalTwat from '../misc/modal-twat';
import RenderBlocker from '../misc/render-blocker';
import ModalTwatComposer from '../misc/modal-twat-composer';

import './app.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldPageUpdate: true,
      twatComposerOpen: false,
    };

    this.hideModalTwatComposer = this.hideModalTwatComposer.bind(this);
    this.showModalTwatComposer = this.showModalTwatComposer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;

    // If we're about to show a Twat modal, prevent the main page content from
    // rendering again (otherwise it'll default to the Dashboard route).
    if (nextProps.location !== location) {
      const showingTwat = matchPath(nextProps.location.pathname, { path: '/twat/:id' }) !== null;
      this.setState({ shouldPageUpdate: !showingTwat });
    }
  }

  hideModalTwatComposer() {
    this.setState({ twatComposerOpen: false });
  }

  showModalTwatComposer() {
    this.setState({ twatComposerOpen: true });
  }

  render() {
    const { location, lastLocation } = this.props;
    const { shouldPageUpdate, twatComposerOpen } = this.state;

    return (
      <div>
        {location.pathname !== '/login'
          ? <NavBar showModalTwatComposer={this.showModalTwatComposer} />
          : null}

        <RenderBlocker block={!shouldPageUpdate}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/user/:username" component={UserPage} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </RenderBlocker>

        <ModalTwatComposer
          visible={twatComposerOpen}
          hideModalTwatComposer={this.hideModalTwatComposer}
        />

        <ModalRoute
          exact
          path="/twat/:twatId"
          parentPath={lastLocation || '/'}
          className="react-router-modal__modal modal-twat"
          component={ModalTwat}
        />

        <ModalContainer />
      </div>
    );
  }
}

export default withLastLocation(withRouter(App));
