import React, { PureComponent, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { Utility, Project } from 'components/frontend';
import { About } from 'components/reader';
import { Project as GlobalProject, FormattedDate } from 'components/global';

export default class AboutOverlayDetail extends PureComponent {

  static propTypes = {
    text: PropTypes.object,
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

  renderProjectThumb(project) {
    let cover;
    let classes;
    if (project.attributes.avatarStyles.small) {
      classes = "figure-wrapper resource-title";
      cover = (
        <img
          src={project.attributes.avatarStyles.small}
          alt={`Click to view ${project.attributes.title}`}
          style={{ maxWidth: "100px", paddingRight: "15px" }}
        />
      );
    } else {
      classes = "figure-wrapper figure-wrapper-placeholder resource-title";
      cover = (
        <div style={{ paddingRight: "15px" }}>
          <GlobalProject.Placeholder
            width="100.34735px"
            height="100.68436px"
          />
        </div>
      );
    }
    return { classes, cover };
  }

  buildRedirectUrl(text) {
    if (!text) return null;
    return (
      `/browse/project/${text.relationships.project.id}`
    );
  }

  render() {
    const text = this.props.text;
    const project = this.props.text.relationships.project;
    const { cover, classes } = this.renderProjectThumb(project);
    const attr = text.attributes;
    const projectUrl = this.buildRedirectUrl(text);

    return (
      <div className="resource-detail">
        <div className="container">
          <div className={classes}>
            <figure>
              {cover}
            </figure>
            <div>
              <h1>{attr.title}</h1>
              <span className="resource-date">
                {'Text added '}
                <FormattedDate
                  format="MMMM, YYYY"
                  date={attr.createdAt}
                />
              </span>
            </div>
          </div>
          <div className="resource-content">
            <p>{attr.description}</p>
          </div>
        </div>
        <section className="resource-hero-container"></section>
        <div className="container">
          <About.Meta
            text={text}
            style="secondary columnar"
            projectUrl={projectUrl}
          />
          <nav className="button-nav">
            <Link to={projectUrl} className="button-secondary outlined">
              Visit Project Page<i className="manicon manicon-arrow-right"></i>
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
