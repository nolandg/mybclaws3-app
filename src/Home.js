import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import './Home.css';
import { Link } from 'react-router-dom';

const QUERY = gql`
  query Users{
    users {
      username
      email
    }
  }
`;

class Home extends Component {
  render() {
    const { data } = this.props;
    const { loading, error } = data;

    if(loading) return 'Waiting for data...';
    if(error) {
      console.error(error);
      return 'There was an error :-(';
    }

    return (
      <div className="Home">
        <h1>My BC Laws</h1>
        User Count: {data.users.length} <br />
        User 0: {data.users[0].username} <br />
        User 1: {data.users[1].username} <br />
        <Link to="/about">About</Link>
      </div>
    );
  }
}

Home.propTypes = {
  data: PropTypes.object.isRequired,
};

// export default Home;
export default graphql(QUERY, {
  options: { errorPolicy: 'none' },
})(Home);
