import React, { PureComponent, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { ResourceList } from 'components/frontend';
import { Utility, Resource } from 'components/frontend';
import Icon from 'components/frontend/Resource/Icon';

export default class ResourceOverlayDetail extends PureComponent {

  static propTypes = {
    resource: PropTypes.object,
    handleClose: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleEscape = this.handleEscape.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleEscape);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleEscape);
  }

  handleEscape(event) {
    if (event.keyCode === 27) {
      this.props.handleClose(event);
    }
  }

  buildRedirectUrl(resource) {
    if (!resource) return null;
    const pId = resource.relationships.project.id;
    return (
      `/browse/project/${pId}/resource/${resource.id}`
    );
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const resourceUrl = this.buildRedirectUrl(resource);

    return (
      <div className="resource-detail">
        <div className="container">
          <div className="resource-kind">
            <figure className={`resource-icon ${attr.kind}`}>
              <Icon.Composer kind={attr.kind}/>
            </figure>
          </div>
          <Resource.Title resource={resource} />
          <div className="resource-content">
            <p dangerouslySetInnerHTML={{ __html: attr.captionFormatted }}>
            </p>
            <p dangerouslySetInnerHTML={{ __html: attr.descriptionFormatted }}>
            </p>
          </div>

          {/*
            <div className="resource-default">
              <ResourceList.Slide.Slide
                  resource={resource}
              />
            </div>
          */}
        </div>
        <Resource.Hero resource={resource} />
        <div className="container">
          <Resource.Meta
            resource={resource}
            style={'secondary columnar'}
            showIcon={false}
            showTags={false}
          />

          <nav className="button-nav">
            <Resource.Link attributes={attr} buttonClass="button-secondary outlined" /><br/>
            <Link to={resourceUrl} className="button-secondary outlined">
              Visit Resource Page<i className="manicon manicon-arrow-right"></i>
            </Link><br/>
            <button onClick={this.props.handleClose} className="button-secondary outlined dull">
              <i className="manicon manicon-arrow-left"></i>Return to Reader
            </button>
          </nav>
        </div>
      </div>
    );
  }
}
