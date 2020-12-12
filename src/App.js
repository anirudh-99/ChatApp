import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import Chat from "./components/chat/chat";
import { Switch, BrowserRouter,Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <div className="app__body">
        <BrowserRouter>
          <Sidebar />
          <Route path="/rooms/:roomId">
            <Chat />
          </Route>
          <Route path="/"></Route>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
