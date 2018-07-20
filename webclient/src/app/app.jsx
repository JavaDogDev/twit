import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { ModalContainer, ModalRoute } from 'react-router-modal';
import 'react-router-modal/css/react-router-modal.css';

import Login from './login';
import NavBar from './nav-bar';
import UserPage from './user-page';
import Dashboard from './dashboard';
import ModalTwat from '../misc/modal-twat';
import ModalTwatComposer from '../misc/modal-twat-composer';

import './app.scss';

class App extends React.Component {
  constructor() {
    super();
    this.state = { twatComposerOpen: false };
    this.hideModalTwatComposer = this.hideModalTwatComposer.bind(this);
    this.showModalTwatComposer = this.showModalTwatComposer.bind(this);
  }

  hideModalTwatComposer() {
    this.setState({ twatComposerOpen: false });
  }

  showModalTwatComposer() {
    this.setState({ twatComposerOpen: true });
  }

  render() {
    return (
      <div>
        {this.props.location.pathname !== '/login'
          ? <NavBar showModalTwatComposer={this.showModalTwatComposer} />
          : null}

        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/user/:username" component={UserPage} />
          <Route path="/" component={Dashboard} />
        </Switch>

        <ModalTwatComposer
          visible={this.state.twatComposerOpen}
          hideModalTwatComposer={this.hideModalTwatComposer}
        />

        <ModalRoute
          exact
          path="/twat/:twatId"
          parentPath={this.props.match.url}
          className="react-router-modal__modal modal-twat"
          component={ModalTwat}
        />

        <ModalContainer />
      </div>
    );
  }
}

export default withRouter(App);
