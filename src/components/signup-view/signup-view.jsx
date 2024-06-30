import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./signup-view.scss";

export const SignupView = ({ onSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation example: Ensure all fields are filled out
    if (!username || !password || !email || !birthday) {
      setError("Please fill out all fields.");
      return;
    }

    const signupData = {
      username: username,
      password: password,
      email: email,
      birthday: birthday,
    };

    // Call the onSignup function passed from parent component
    onSignup(signupData);
  };

  return (
    <div className="signup-view">
      <div className="signup-container">
        <h2 className="signup-heading">Create Account</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="signup-input"
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-input"
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-input"
            />
          </Form.Group>

          <Form.Group controlId="formBirthday">
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
              className="signup-input"
            />
          </Form.Group>

          {error && <div className="signup-error">{error}</div>}

          <Button variant="primary" type="submit" className="signup-button">
            Sign Up
          </Button>
        </Form>
      </div>
    </div>
  );
};
