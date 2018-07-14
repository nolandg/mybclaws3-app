import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';


import PostsList from './PostsList';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <Helmet>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Helmet>
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
