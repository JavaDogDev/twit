import * as React from 'react';
import { ModalContainer } from 'react-router-modal';
import 'react-router-modal/css/react-router-modal.css';

import NavBar from './nav-bar';
import Trough from '../trough/trough';
import ModalTwatComposer from '../misc/modal-twat-composer';
import ModalTwat from '../misc/modal-twat';
import './dashboard.scss';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = { twatModalOpen: false };
    this.hideModalTwatComposer = this.hideModalTwatComposer.bind(this);
    this.showModalTwatComposer = this.showModalTwatComposer.bind(this);
  }

  hideModalTwatComposer() {
    this.setState({ twatModalOpen: false });
  }

  showModalTwatComposer() {
    this.setState({ twatModalOpen: true });
  }

  render() {
    return (
      <div className="dashboard-wrapper">
        <NavBar showModalTwatComposer={this.showModalTwatComposer} />

        <main>
          <div className="user-info">
            <div className="header-image" />

            <div className="user-info-contents">
              <div>
                <i className="material-icons">face</i>
                <div>
                  <div className="display-name">Display Name</div>
                  <div className="username">@username</div>
                </div>
              </div>
              <div className="user-stats">
                <div className="user-stats-column">
                  <div>Twats</div>
                  <div>45</div>
                </div>
                <div className="user-stats-column">
                  <div>Following</div>
                  <div>954</div>
                </div>
              </div>
            </div>
          </div>

          <Trough />

          <div className="trends">
            <h3>Trends for you</h3>
            <ul>
              <li>
                <div className="trend">Trend Thing Here 1</div>
                <div className="twat-quantity">6543 Twats</div>
              </li>
              <li>
                <div className="trend">Trend Thing Here 2</div>
                <div className="twat-quantity">7654 Twats</div>
              </li>
              <li>
                <div className="trend">Trend Thing Here 3</div>
                <div className="twat-quantity">876556 Twats</div>
              </li>
              <li>
                <div className="trend">Trend Thing Here 4</div>
                <div className="twat-quantity">765454 Twats</div>
              </li>
            </ul>
          </div>

          <ModalTwatComposer
            visible={this.state.twatModalOpen}
            hideModalTwatComposer={this.hideModalTwatComposer}
          />

          <ModalTwat />
        </main>

        <ModalContainer />
      </div>
    );
  }
}

export default Dashboard;
