import React, { useState, useContext } from "react";
import classes from "./signup.module.css";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";
import axios from "../../axios";

export default function Signup(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [name, setName] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const newUser = { name, email, password, passwordConfirm };
      await axios.post("/signup", newUser);
      const loginRes = await axios.post("/login", { email, password });
      const { token, user } = { ...loginRes.data };
      setUserData({ token, user });
      localStorage.setItem("auth-token", token);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.Signup__container}>
      <h1 className={classes.Signup__heading}>Register</h1>
      <form className={classes.Signup__form} onSubmit={submitHandler}>
        <label>Name</label>
        <br />
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />

        <label>Email</label>
        <br />
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <label>Password</label>
        <br />
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <label>Confirm Password</label>
        <br />
        <input
          type="password"
          placeholder="Enter same password"
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />
        <br />

        <button type="submit" className={classes.Signup__button}>
          Register
        </button>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
