import React, { PureComponent, PropTypes } from 'react';
import { Project, Navigation } from 'components/backend';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { connect } from 'react-redux';
import { notificationActions } from 'actions';
import { projectsAPI } from 'api';
import { browserHistory } from 'react-router';
import { entityUtils } from 'utils';

class NewProjectWrapperContainer extends PureComponent {

  static displayName = "NewProject.WrapperContainer";

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  redirectToProject(project) {
    browserHistory.push(`/backend/project/${project.id}`);
  }

  handleSuccess(project) {
    this.redirectToProject(project);
  }

  render() {
    return (
      <div>
        <Navigation.DetailHeader
          type="project"
          breadcrumb={[
            { path: "/backend", label: "ALL PROJECTS" }
          ]}
          title={'New Project'}
          showUtility={false}
          note={'Enter the name of your project, and a brief description. Press save to continue.'}
        />
        <section className="backend-panel">
          <div className="container">
            <div className="panel">
              <section>
                <FormContainer.Form
                  route={this.props.routes[this.props.routes.length - 1]}
                  model={this.props.project}
                  name="backend-create-project"
                  update={projectsAPI.update}
                  create={projectsAPI.create}
                  onSuccess={this.handleSuccess}
                  className="form-secondary"
                >
                  <Form.TextInput
                    validation={["required"]}
                    focusOnMount
                    label="Title"
                    name="attributes[title]"
                    placeholder="Enter Project Title"
                  />
                  <Form.TextInput
                    label="Subtitle"
                    name="attributes[subtitle]"
                    placeholder="Enter Project Subtitle"
                  />
                  <Form.TextArea
                    label="Description"
                    name="attributes[description]"
                    height={100}
                  />
                  <Form.Save
                    text="Save and Continue"
                    cancelRoute={`/backend`}
                  />
                </FormContainer.Form>
              </section>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(
  NewProjectWrapperContainer.mapStateToProps
)(NewProjectWrapperContainer);

