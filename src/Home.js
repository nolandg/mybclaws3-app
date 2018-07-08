import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import './Home.css';
import { Link } from 'react-router-dom';

const QUERY = gql`
  query Users{
    userss {
      username
      email
    }
  }
`;

class Home extends Component {
  // static async getInitialProps({ req, res, match, history, location, ...ctx }) {
  //   return {data: 'hi'};
  // }

  render() {
    const { data } = this.props;
    const loading = data.loading === true;

    if(loading) return 'Waiting for data...';

    return (
      <div className="Home">
        <h1>My BC Laws</h1>
        Users: {data.users.length} <br />
        User 0: {data.users[0].username} <br />
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
  options: { errorPolicy: 'all' },
})(Home);
