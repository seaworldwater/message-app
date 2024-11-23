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

  function joinRoom() {
    setRoomStatus(`You are in room ${room}.`);
    socket.emit("join-room", room);
  }

  function sendMessage() {
    socket.emit("send-message", { currentMessage, room });
    setMessages([...messages, ["sent", currentMessage]]);
  }

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages([...messages, ["received", data.currentMessage]]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("people-in-room", (data) => {
      if (data[1] - 1 == 1) {
        setRoomStatus(
          `You are in room ${data[0]}. There is ${
            data[1] - 1
          } other person here.`
        );
      } else {
        setRoomStatus(
          `You are in room ${data[0]}. There are ${
            data[1] - 1
          } other people here.`
        );
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
          />
          <button className="button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
      <div className="wrapper">{roomStatus}</div>
      <div className="wrapper">
        {messages.map((message) => (
          <div key={message[0]} className={message[0]}>
            {message[1]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
