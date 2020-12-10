import "./App.css";
import { useEffect } from "react";
import Sidebar from "./components/sidebar/sidebar";
import Chat from "./components/chat/chat";
import Pusher from "pusher-js";

function App() {
  

  useEffect(() => {
    const pusher = new Pusher("f891c6ff78f3484303a0", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (data) => {
      alert(JSON.stringify(data));
    });
  }, []);

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default App;
