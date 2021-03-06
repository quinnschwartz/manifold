import React, { Children, PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import DocumentMeta from 'react-document-meta';
import { SignInUp, LoadingBar } from 'components/global';
import config from '../config';
import has from 'lodash/has';
import get from 'lodash/get';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { notificationActions, uiVisibilityActions } from 'actions';
import { meAPI, settingsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { closest } from 'utils/domUtils';
import ReactGA from 'react-ga';

const { request } = entityStoreActions;
const { visibilityHide } = uiVisibilityActions;

class ManifoldContainer extends PureComponent {


  // This method will bootstrap data into manifold. Nothing else is loaded into the
  // store at this point, including params and the authenticated user.
  static bootstrap(getState, dispatch) {
    // if (__CLIENT__) return;
    const promises = [];
    const loaded = has(getState(), 'entityStore.entities.settings.0');
    if (loaded) return Promise.all(promises);

    const settingsRequest = request(settingsAPI.show(), requests.settings, { oneTime: true });
    promises.push(dispatch(settingsRequest));
    return Promise.all(promises);
  }

  static mapStateToProps(state) {
    return {
      authentication: state.authentication,
      visibility: state.ui.visibility,
      loading: state.ui.loading.active,
      notifications: state.notifications,
      routing: state.routing,
      settings: entityUtils.select(requests.settings, state.entityStore)
    };
  }

  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    visibility: PropTypes.object,
    authentication: PropTypes.object,
    children: PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.element
    ])
  };

  constructor(props) {
    super(props);
    this.gaInitialized = false;
    this.handleGlobalClick = this.handleGlobalClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.userJustLoggedIn(this.props.authentication, nextProps.authentication)) {
      this.doPostLogin(nextProps);
    }
    if (this.userJustLoggedOut(this.props.authentication, nextProps.authentication)) {
      this.doPostLogout(nextProps);
    }
    if (this.receivedGaTrackingId(nextProps.settings) && !this.gaInitialized) {
      ReactGA.initialize(nextProps.settings.attributes.general.gaTrackingId);
      this.gaInitialized = true;
      nextProps.gaInitCallback();
    }
  }

  receivedGaTrackingId(nextSettings) {
    const path = 'attributes.general.gaTrackingId';
    return has(nextSettings, path) && get(nextSettings, path) !== "";
  }

  userJustLoggedIn(auth, nextAuth) {
    return nextAuth.authenticated === true && auth.authenticated === false;
  }

  userJustLoggedOut(auth, nextAuth) {
    return nextAuth.authenticated === false && auth.authenticated === true;
  }

  doPostLogin(props) {
    this.notifyLogin(props);
  }

  doPostLogout(props) {
    this.notifyLogout(props);
    this.redirectToHome();
  }

  redirectToHome() {
    browserHistory.push('/');
  }

  updateCurrentUser() {
    this.props.dispatch(request(meAPI.show(), requests.gAuthenticatedUserUpdate));
  }

  notifyLogin() {
    const notification = {
      level: 0,
      id: 'AUTHENTICATION_STATE_CHANGE',
      heading: "You have logged in successfully."
    };
    this.props.dispatch(notificationActions.addNotification(notification));
    setTimeout(() => {
      this.props.dispatch(notificationActions.removeNotification(notification.id));
    }, 5000);
  }

  notifyLogout() {
    const notification = {
      level: 0,
      id: 'AUTHENTICATION_STATE_CHANGE',
      heading: "You have logged out successfully."
    };
    this.props.dispatch(notificationActions.addNotification(notification));
    setTimeout(() => {
      this.props.dispatch(notificationActions.removeNotification(notification.id));
    }, 5000);
  }

  handleGlobalClick(event) {
    if (!closest(event.target, '.panel-visible')) {
      this.props.dispatch(uiVisibilityActions.panelHideAll());
    }
  }

  render() {

    const hideSignInUpOverlay = bindActionCreators(
      () => visibilityHide('signInUpOverlay'), this.props.dispatch
    );

    return (
      <div onClick={this.handleGlobalClick} className="global-container">
        <DocumentMeta {...config.app}/>
        <LoadingBar loading={this.props.loading} />
        <ReactCSSTransitionGroup
          transitionName={'overlay-login'}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          { this.props.visibility.signInUpOverlay ?
            <SignInUp.Overlay
              key="signInUpOverlay"
              hideSignInUpOverlay={hideSignInUpOverlay}
              authentication={this.props.authentication}
              dispatch={this.props.dispatch}
              hash={get(this, 'props.routing.locationBeforeTransitions.hash')}
            />
            : null}
        </ReactCSSTransitionGroup>
        {this.props.children}
      </div>
    );
  }

}

const Manifold = connect(
  ManifoldContainer.mapStateToProps
)(ManifoldContainer);

export default Manifold;
