import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5174/");

function App() {
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [roomStatus, setRoomStatus] = useState(
    "You are not currently in a room."
  );
  const [clientsStatus, setClientsStatus] = useState("");
  const [disabled, setDisabled] = useState(true);

  function joinRoom() {
    setRoomStatus(`You are in room ${room}.`);
    socket.emit("join-room", room);
    setDisabled(false);
  }

  function sendMessage() {
    socket.emit("send-message", { currentMessage, room });
    setMessages((messages) => [...messages, ["sent", currentMessage]]);
  }

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((messages) => [
        ...messages,
        ["received", data.currentMessage],
      ]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("people-in-room", (data) => {
      if (data[1] - 1 == 1) {
        setClientsStatus(`There is ${data[1] - 1} other person here.`);
      } else {
        setClientsStatus(`There are ${data[1] - 1} other people here.`);
      }
    });
  }, [socket]);

  return (
    <div className="master">
      <div className="container">
        <div className="wrapper">
          <input
            type="text"
            className="input"
            placeholder="Room..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button className="button" onClick={joinRoom}>
            Join
          </button>
        </div>
        <div className="wrapper">
          <input
            type="text"
            className="input"
            placeholder="Message..."
            onChange={(e) => setCurrentMessage(e.target.value)}
            disabled={disabled}
          />
          <button className="button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
      <div className="wrapper">
        <h2 className="room-status">{roomStatus}</h2>
        <h3 className="client-status">{clientsStatus}</h3>
      </div>
      <div className="wrapper">
        {messages.map((message) => (
          <div key={message[1]} className={message[0]}>
            {message[1]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
