import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic } from '@fortawesome/free-solid-svg-icons'
// import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar bg-primary'>
      <h1>
      <FontAwesomeIcon icon={faMusic} />
      </h1>
      <h1>ScoreShare</h1>
    </nav>
  );
};


export default Navbar;
