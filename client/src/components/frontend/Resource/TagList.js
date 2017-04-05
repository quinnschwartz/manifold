import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ResourceTagList extends Component {

  static displayName = "Resource.TagList";

  static propTypes = {
    resource: PropTypes.object,
    disabledLinks: PropTypes.bool
  };

  static defaultProps = {
    disabledLinks: false
  };

  constructor(props) {
    super();
  }

  mapTagsToLinks(attr) {
    if (!attr.tagList) return null;
    const tags = attr.tagList;
    const out = [];
    tags.map((tag, index) => {
      out.push(this.createTagLink(tag, index));
    });
    return out;
  }

  createTagLink(tag, index) {
    const project = this.props.resource.relationships.project;
    if (!tag || !project) return null;
    return (
      <li key={index}>
        {/* Will be route to view resources by tags */}
        <Link
          className={this.props.disabledLinks ? "disabled" : null}
          to={`/browse/project/${project.id}/resources?tag=${tag.toLowerCase()}`}
        >
          {tag}
        </Link>
      </li>
    );
  }

  render() {
    if (!this.props.resource) return null;
    return (
      <nav className="resource-tag-list">
        <ul>
          {this.mapTagsToLinks(this.props.resource.attributes)}
        </ul>
      </nav>
    );
  }
}
