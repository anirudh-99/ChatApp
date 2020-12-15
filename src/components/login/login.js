import React, { useState, useContext } from "react";
import classes from "./login.module.css";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";
import axios from "../../axios";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { userData,setUserData } = useContext(UserContext);
  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await axios.post("/login", { email, password });
      const { token, user } = { ...loginRes.data };
      setUserData({ token, user });
      localStorage.setItem("auth-token", token);
      history.push("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className={classes.Login__container}>
      <h1 className={classes.Login__heading}>Login</h1>
      <form className={classes.Login__form} onSubmit={submitHandler}>
        <label>Username</label>
        <br />
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        <br />

        <label>Password</label>
        <br />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
        <br />

        <button type="submit" className={classes.Login__button}>
          Login
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
