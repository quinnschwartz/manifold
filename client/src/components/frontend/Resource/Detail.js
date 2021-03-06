import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { Utility, Resource } from 'components/frontend';

export default class ResourceDetail extends Component {

  static displayName = "Resource.Detail";

  static propTypes = {
    projectId: PropTypes.string,
    projectUrl: PropTypes.string,
    resourceUrl: PropTypes.string.isRequired,
    resource: PropTypes.object
  };

  createDescription(description) {
    if (!description) return { __html: 'No content provided.' };
    return {
      __html: description
    };
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const resourceUrl = `${this.props.resourceUrl}/${resource.id}`;

    return (
      <div>
        <section>
          <section className="resource-detail">
            <div className="container flush-top flush-bottom">
              <Resource.Title resource={resource} showIcon={false}/>
            </div>

              <Resource.Hero resource={resource}/>

            <div className="container flush-top">
              <aside>
                <Resource.Link attributes={attr}/>
                {/*
                <Link to="#" className="button-primary">
                  View in Text <i className="manicon manicon-arrow-right"></i>
                </Link>
                */}
                 <Utility.ShareBar url={resourceUrl}/>
                <Resource.Meta
                  resource={resource}
                  style={'secondary'}
                  projectUrl={this.props.projectUrl}
                />
              </aside>
              <div className="resource-content left">
                <div dangerouslySetInnerHTML={{ __html: attr.captionFormatted }} />

                <h3 className="attribute-header">
                  Full Description
                </h3>
                <div dangerouslySetInnerHTML={this.createDescription(attr.descriptionFormatted)} />
              </div>
              <div className="resource-meta-mobile">
                <Resource.Meta
                  resource={resource}
                  style={'primary'}
                  projectUrl={this.props.projectUrl}
                />
              </div>
            </div>
          </section>
        </section>
      </div>
    );
  }
}
