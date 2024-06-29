import React, { useState } from 'react';
import '../styles/register.css';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ firstname, lastname, email, password });
  };

  return (
    <section>
      <div className="login-container">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-user"></i>
            </span>
            <input
              required
              type="text"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <label htmlFor="firstname">Enter your first name</label>
          </div>

          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-user"></i>
            </span>
            <input
              required
              type="text"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label htmlFor="lastname">Enter your last name</label>
          </div>

          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input
              required
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Enter your email</label>
          </div>

          <div className="input-box">
            <span className="icon">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              required
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Enter your password</label>
          </div>

          <button type="submit">Register</button>
        </form>

        <div className="create-account">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Register;
