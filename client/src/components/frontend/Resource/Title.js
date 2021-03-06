import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import FormattedDate from 'components/global/FormattedDate';
import Icon from './Icon';

export default class ResourceTitle extends Component {

  static displayName = "Resource.Title";

  static propTypes = {
    resource: PropTypes.object,
    showIcon: PropTypes.bool,
    showDate: PropTypes.bool
  };

  static defaultProps = {
    showIcon: true,
    showDate: true
  };

  render() {
    const attr = this.props.resource.attributes;

    return (
      <div className="resource-title">
        {this.props.showIcon ?
          <figure className={`resource-icon ${attr.kind}`}>
            <Icon.Composer kind={attr.kind}/>
          </figure> : null
        }
        <div>
          <h1 dangerouslySetInnerHTML={{ __html: attr.titleFormatted }} />
          {this.props.showDate ?
            <span className="resource-date">
              {'Resource added '}
              <FormattedDate
                format="MMMM, YYYY"
                date={attr.createdAt}
              />
            </span> : null
          }
        </div>
      </div>
    );
  }
}
