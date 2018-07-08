import React, { Component } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

import PostsList from './PostsList';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <h1>My BC Laws</h1>
        <PostsList />
        <Link to="/about">About</Link>
      </div>
    );
  }
}

Home.propTypes = {
};

export default Home;
