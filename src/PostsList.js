import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import './Home.css';

// import { Link } from 'react-router-dom';

const QUERY = gql`
  query Posts{
    posts {
      _id
      title
    }
  }
`;

class PostsList extends Component {
  renderPost = post => (
    <div key={post._id}>
      <h4>{post.title}</h4>
    </div>
  )

  render() {
    const { data } = this.props;
    const { loading, error } = data;

    if(loading) return 'Waiting for data...';
    if(error) {
      console.error(error);
      return 'There was an error :-(';
    }

    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="headline" component="h3">
            This is a sheet of paper.
          </Typography>
          <Typography component="p">
            Paper can be used to build surface or other elements for your application.
          </Typography>
        </Paper>
        {data.posts.map(post => this.renderPost(post))}
      </div>
    );
  }
}

PostsList.propTypes = {
  data: PropTypes.object.isRequired,
};

// export default Home;
export default graphql(QUERY, {
  options: { errorPolicy: 'all' },
})(PostsList);
