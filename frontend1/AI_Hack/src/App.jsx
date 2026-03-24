import React from 'react';
import Preloader from './Preloader';
import Login from './Login';
import './style.css'; // Importing your CSS file globally here

const App = () => {
  return (
    <>
      <Preloader />
      <Login />
    </>
  );
};

export default App;