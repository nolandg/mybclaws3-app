import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
      <Typography variant="display2" gutterBottom>{post.title}</Typography>
      <Button variant="contained">
        <SaveIcon />Add a thing
      </Button>
    </div>
  )

  render() {
    const { data } = this.props;
    const { loading, error } = data;

    if(loading) return 'Waiting for data...';
    if(error) {
      console.error('Error getting data in component: ', error);
      return 'There was an error :-(';
    }

    return (
      <div>
        <Typography variant="display3" gutterBottom>
          Posts List
        </Typography>
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
