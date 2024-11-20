import { useState } from "react";
import "./App.css";

function App() {
  const [messagesReceived, setMessagesReceived] = useState([]);
  const [messagesSent, setMessagesSent] = useState([]);
  const [room, setRoom] = useState("");

  return (
    <div className="master">
      <div className="container">
        <input type="text" className="input" placeholder="Room..." />
        <button className="button">Join</button>
      </div>
      <div className="container">
        <input type="text" className="input" placeholder="Message..." />
        <button className="button">Send</button>
      </div>
      <div>
        {messagesReceived.map((message) => (
          <div>{message}</div>
        ))}
        {messagesSent.map((message) => (
          <div>{message}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
