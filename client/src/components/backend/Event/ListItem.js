import React, { PureComponent, PropTypes } from 'react';
import FormattedDate from 'components/global/FormattedDate';
import { Event } from 'components/frontend';

export default class EventListItem extends PureComponent {

  static displayName = "Event.ListItem";

  static propTypes = {
    event: PropTypes.object,
    destroyHandler: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.triggerDestroy = this.triggerDestroy.bind(this);
  }

  triggerDestroy(event) {
    event.preventDefault();
    this.props.destroyHandler(this.props.entity);
  }

  render() {
    const event = this.props.entity;
    const attr = event.attributes;
    return (
      <li className="list-item">
        <header>
          <figure className="cover">
            <Event.Thumbnail
              event={event}
            />
          </figure>
          <div className="meta">
            <h3 className="name">
              <span>
                {attr.eventTitle}
              </span>
              <span className="subtitle">
                <FormattedDate
                  format="MMMM DD, YYYY"
                  date={attr.createdAt}
                />
              </span>
            </h3>
          </div>
        </header>
          <div className="content">
            { attr.excerpt ? attr.excerpt : attr.subjectTitle }
          </div>
          <div className="utility">
            <i className="manicon manicon-trashcan" onClick={this.triggerDestroy}/>
          </div>
      </li>
    );

  }

}
