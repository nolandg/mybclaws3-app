import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';


import PostsList from './PostsList';
import PostsList2 from './PostsList2';

class Home extends Component {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    return (
      <div className="Home">
        <Helmet>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Helmet>
        <PostsList2 />
        <Link to="/about">About</Link>
      </div>
    );
  }
}

Home.propTypes = {
};

export default Home;
