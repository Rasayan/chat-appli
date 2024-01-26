"use client"

import React, { useEffect, useState } from "react";
import style from "../../styles/page.module.css";

class ChatPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMsg: "",
      chat: [],
    };

    this.sendData = this.sendData.bind(this);
  }

  sendData(e) {
    e.preventDefault();
    const { currentMsg } = this.state;
    const { socket, username, roomId } = this.props;

    if (currentMsg !== "") {
      const msgData = {
        roomId,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      socket.emit("send_msg", msgData);
      this.setState({ currentMsg: "" });
    }
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on("receive_msg", (data) => {
      this.setState((prevState) => ({
        chat: [...prevState.chat, data],
      }));
    });
  }

  render() {
    const { username, roomId } = this.props;
    const { currentMsg, chat } = this.state;

    return (
      <div className={style.chat_div}>
        <div className={style.chat_border}>
          <div style={{ marginBottom: "1rem" }}>
            <p>
              Name: <b>{username}</b> and Room Id: <b>{roomId}</b>
            </p>
          </div>
          <div>
            {chat.map(({ roomId, user, msg, time }, key) => (
              <div
                key={key}
                className={
                  user === username
                    ? style.chatProfileRight
                    : style.chatProfileLeft
                }
              >
                <span
                  className={style.chatProfileSpan}
                  style={{ textAlign: user === username ? "right" : "left" }}
                >
                  {user.charAt(0)}
                </span>
                <h3 style={{ textAlign: user === username ? "right" : "left" }}>
                  {msg}
                </h3>
              </div>
            ))}
          </div>
          <div>
            <form onSubmit={(e) => this.sendData(e)}>
              <input
                className={style.chat_input}
                type="text"
                value={currentMsg}
                placeholder="Type your message.."
                onChange={(e) => this.setState({ currentMsg: e.target.value })}
              />
              <button className={style.chat_button}>Send</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatPage;
