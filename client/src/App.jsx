import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("https://message-app-jbm8.onrender.com");

function App() {
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [roomStatus, setRoomStatus] = useState(
    "You are not currently in a room."
  );
  const [clientsStatus, setClientsStatus] = useState("");
  const [messageDisabled, setMessageDisabled] = useState(true);

  function joinRoom() {
    let newRoom = document.getElementById("roomInput").value;
    setRoomStatus(`You are in room ${newRoom}.`);
    socket.emit("join-room", { room, newRoom });
    setRoom(newRoom);
    setMessageDisabled(false);
    setMessages([]);
  }

  function sendMessage() {
    let id = socket.id;
    socket.emit("send-message", { currentMessage, room, id });
    setMessages((messages) => [
      ...messages,
      [["sent", socket.id], currentMessage],
    ]);
  }

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((messages) => [
        ...messages,
        [["received", data.id], data.currentMessage],
      ]);
    });
  }, [socket]);

  useEffect(() => {
    const wrapper = document.getElementById("messages-wrapper");
    wrapper.scrollTop = wrapper.scrollHeight;
  }, [messages]);

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
            id="roomInput"
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
            disabled={messageDisabled}
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
      <div className="messages-wrapper" id="messages-wrapper">
        {messages.map((message) => (
          <div key={`${messages.indexOf(message)}`} className={message[0][0]}>
            <div>{message[0][1]}</div>
            <div>{message[1]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
