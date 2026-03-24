import React, { useState } from 'react';
import './style.css';

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">
      
      {/* Sign Up Form */}
      <div className="sign-up">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Create Account</h1>
          <div className="icons">
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
          </div>
          <span>or use email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="sign-in">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Sign In</h1>
          <div className="icons">
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
          </div>
          <span>or use email password</span>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <a href="#">Forgot password</a>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Blue Toggle Panel */}
      <div className="toogle-container">
        <div className="toogle">
          <div className="toogle-panel toogle-left">
            <h1>Welcome User!</h1>
            <p>If you already have an account</p>
            <button className="hidden" onClick={() => setIsActive(false)}>
              Sign In
            </button>
          </div>
          <div className="toogle-panel toogle-right">
            <h1>Hello, User!</h1>
            <p>If you don't have an account</p>
            <button className="hidden" onClick={() => setIsActive(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;