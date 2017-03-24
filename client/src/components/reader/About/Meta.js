import React, { Component, PropTypes } from 'react';
import FormattedDate from 'components/global/FormattedDate';

export default class AboutMeta extends Component {

  static displayName = "About.Meta";

  static propTypes = {
    text: PropTypes.object,
    style: PropTypes.string,
    showIcon: PropTypes.bool,
    showTags: PropTypes.bool,
    projectUrl: PropTypes.string
  };

  static defaultProps = {
  };

  constructor(props) {
    super();
  }

  render() {
    const attr = this.props.text.attributes;

    return (
      <section className="resource-meta">
        <ul className={`meta-list-${this.props.style}`}>
          <li>
            <span className="meta-label">Creators</span>
            <span className="meta-value">{attr.creatorNames}</span>
          </li>
          <li>
            <span className="meta-label">Rights</span>
            <span className="meta-value">{attr.rights}</span>
          </li>
          <li>
            <span className="meta-label">Language</span>
            <span className="meta-value">{attr.language}</span>
          </li>
          <li>
            <span className="meta-label">Published</span>
            <span className="meta-value">{attr.published ? `Yes` : `No`}</span>
          </li>
          {attr.published && attr.publicationDate ?
            <li>
              <span className="meta-label">{`Publication Date`}</span>
              <span className="meta-value">
                <FormattedDate
                  format="MMMM DD, YYYY"
                  date={attr.publicationDate}
                />
              </span>
            </li> : null
          }
        </ul>
      </section>
    );
  }
}
