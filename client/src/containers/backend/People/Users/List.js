import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Drawer, UserList } from 'components/backend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { usersAPI, requests } from 'api';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { User, List } from 'components/backend';

const { select, meta } = entityUtils;
const { request } = entityStoreActions;
const perPage = 10;

class UsersListContainer extends PureComponent {

  static displayName = "Users.List";
  static activeNavItem = "users";

  static mapStateToProps(state) {
    return {
      users: select(requests.beUsers, state.entityStore),
      usersMeta: meta(requests.beUsers, state.entityStore),
      currentUserId: get(state, 'authentication.currentUser.id')
    };
  }

  static propTypes = {
    users: PropTypes.array
  };

  constructor() {
    super();
    this.state = { filter: {} };
    this.lastFetchedPage = null;
    this.usersPageChangeHandlerCreator = this.usersPageChangeHandlerCreator.bind(this);
    this.fetchUsers = debounce(
      this.fetchUsers.bind(this), 250, { leading: false, trailing: true }
      );
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
  }

  componentDidMount() {
    this.fetchUsers(1);
  }

  componentWillReceiveProps(nextProps) {
    this.maybeReload(nextProps.usersMeta);
  }

  maybeReload(nextUsersMeta) {
    const currentModified = get(this.props, 'usersMeta.modified');
    const nextModified = get(nextUsersMeta, 'modified');
    if (!nextModified) return;
    if (currentModified && nextModified) return;
    this.fetchUsers(this.lastFetchedPage);
  }

  fetchUsers(page) {
    this.lastFetchedPage = page;
    const pagination = { number: page, size: perPage };
    const action = request(
      usersAPI.index(this.state.filter, pagination),
      requests.beUsers
    );
    this.props.dispatch(action);
  }

  filterChangeHandler(filter) {
    this.setState({ filter }, () => {
      this.fetchUsers(1);
    });
  }

  handleUsersPageChange(event, page) {
    this.fetchUsers(page);
  }

  usersPageChangeHandlerCreator(page) {
    return (event) => {
      this.handleUsersPageChange(event, page);
    };
  }

  render() {
    if (!this.props.users) return null;
    const { children, users, usersMeta, currentUserId } = this.props;
    const active = this.props.params.id;

    return (
      <div>
        <header className="section-heading-secondary">
          <h3>
            {'Users'} <i className="manicon manicon-users"></i>
          </h3>
        </header>
        <Drawer.Wrapper
          open={React.Children.count(children) > 0}
          closeUrl="/backend/people/users"
        >
          { children }
        </Drawer.Wrapper>
        { users ?
          <List.Searchable
            entities={users}
            singularUnit="user"
            pluralUnit="users"
            pagination={usersMeta.pagination}
            paginationClickHandler={this.usersPageChangeHandlerCreator}
            entityComponent={User.ListItem}
            entityComponentProps={{ currentUserId, active }}
            filterChangeHandler={this.filterChangeHandler}
          />
          : null
        }
      </div>
    );

  }

}

export default connect(
  UsersListContainer.mapStateToProps
)(UsersListContainer);

