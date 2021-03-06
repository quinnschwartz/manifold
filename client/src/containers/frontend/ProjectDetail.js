import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Project } from 'components/frontend';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, requests } from 'api';

const { select } = entityUtils;
const { visibilityShow } = uiVisibilityActions;
const { request, flush } = entityStoreActions;

class ProjectDetailContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    const projectRequest =
      request(projectsAPI.show(params.id), requests.feProject);
    const { promise: one } = dispatch(projectRequest);
    return Promise.all([one]);
  }

  static mapStateToProps(state) {
    return {
      project: select(requests.feProject, state.entityStore)
    };
  }

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
  }

  render() {
    return <Project.Detail project={this.props.project} dispatch={this.props.dispatch} />;
  }

}

const ProjectDetail = connect(
  ProjectDetailContainer.mapStateToProps
)(ProjectDetailContainer);

export default ProjectDetail;
