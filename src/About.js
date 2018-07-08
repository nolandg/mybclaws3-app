import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class About extends Component {

  renderSomething = () => {
    return 'I rendered';
  }

  render() {
    return <div>
      {this.renderSomething()}<br />
      <Link to="/">Home</Link>
    </div>;
  }
}

export default About;
