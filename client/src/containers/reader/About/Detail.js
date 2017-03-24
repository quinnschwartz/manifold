import React, { PureComponent, PropTypes } from 'react';
import { textsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { connect } from 'react-redux';
import { About } from 'components/reader';

const { select, meta } = entityUtils;
const { request, flush } = entityStoreActions;

class AboutDetailContainer extends PureComponent {

  static displayName = "ReaderContainer.About.Detail";

  static fetchData(getState, dispatch, location, params) {
    const promises = [];
    const textCall = textsAPI.show(params.textId);
    const { promise: one } = dispatch(request(textCall, requests.rText));
    promises.push(one);
    return Promise.all(promises);
  }

  static mapStateToProps(state, ownProps) {
    const newState = {
      text: select(requests.rText, state.entityStore),
      textMeta: meta(requests.rText, state.entityStore),
    };
    return Object.assign({}, newState, ownProps);
  }

  static propTypes = {
    route: PropTypes.object,
    params: PropTypes.object,
    text: PropTypes.object,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rText));
  }

  render() {
    if (!this.props.text) return null;

    return (
      <About.Overlay
        params={this.props.params}
        text={this.props.text}
      />
    );
  }
}

export default connect(
  AboutDetailContainer.mapStateToProps
)(AboutDetailContainer);
