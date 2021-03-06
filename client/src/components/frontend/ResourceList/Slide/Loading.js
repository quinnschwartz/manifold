import React, { Component, PropTypes } from 'react';

export default class ResourceSlideFigureLoading extends Component {

  static displayName = "Resource.Slide.Loading";

  static propTypes = {
    resource: PropTypes.object
  };

  componentDidMount() {
    const parentWidth = this._figure.parentNode.offsetWidth;
    this._figure.style.width = parentWidth + 'px';
  }

  render() {
    return (
      <figure>
        <div
          ref={ (c) => {
            this._figure = c;
          } }
          className="figure-default"
          style={ { backgroundImage: 'url(/static/images/resource-splash.png)' } }
        >
          <div className="resource-info">
            <i className={`manicon manicon-resource-file`}></i>
            <span className="resource-type">
              {'loading'}
            </span>
            <span className="resource-date">
              {'loading'}
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
