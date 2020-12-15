import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import Chat from "./components/chat/chat";
import { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Layout from "./utils/layout";
import axios from "./axios";
import UserContext from "./context/userContext";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  const history = useHistory();

  useEffect(() => {
    const validateToken = async () => {
      //check if token is present in local storage
      let token = localStorage.getItem("auth-token");
      if (!token) {
        history.push("/login");
        return;
      }
      let verifyTokenRes;
      try {
        verifyTokenRes = await axios.get("/verifyToken/" + token);
      } catch (err) {
        history.push("/login");
        return;
      }

      setUserData({
        token,
        user: verifyTokenRes.user,
      });
    };
    validateToken();
  }, []);

  return (
    <div className="app">
      <UserContext.Provider value={{ userData, setUserData }}>
        <Switch>
          <Route path="/rooms/:roomId">
            <Layout>
              <Sidebar />
              <Chat />
            </Layout>
          </Route>
          <Route exact path="/">
            <Layout>
              <Sidebar />
            </Layout>
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
        </Switch>
      </UserContext.Provider>
    </div>
  );
}

export default App;
