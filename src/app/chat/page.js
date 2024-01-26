"use client"

import React, { Component } from 'react';
import styles from '../../../styles/page.module.css';
import { io } from 'socket.io-client';
import ChatPage from '@/components/chat';

const socket = io("http://localhost:3000", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showChat: false,
      userName: '',
      showSpinner: false,
      roomId: '',
      socket: null,
    };

    this.handleJoin = this.handleJoin.bind(this);
  }

  componentDidMount() {
    const socket = io('http://localhost:3000');
    this.setState({ socket });
  }

  handleJoin() {
    const { userName, roomId, socket } = this.state;

    if (!socket) {
      console.error('Socket is null. Socket initialization might be delayed.');
      return;
    }

    if (userName !== '' && roomId !== '') {
      console.log(userName, 'userName', roomId, 'roomId');
      socket.emit('join_room', roomId);
      this.setState({ showSpinner: true });

      // You can remove this setTimeout and add your own logic
      setTimeout(() => {
        this.setState({ showChat: true, showSpinner: false });
      }, 4000);
    } else {
      alert('Please fill in Username and Room Id');
    }
  }

  render() {
    const { showChat, userName, showSpinner, roomId, socket } = this.state;

    if (!socket) {
      return <div>Loading...</div>; 
    }

    return (
      <div>
        <div className={styles.main_div} style={{ display: showChat ? 'none' : '' }}>
          <input
            className={styles.main_input}
            type="text"
            placeholder="Username"
            onChange={(e) => this.setState({ userName: e.target.value })}
            disabled={showSpinner}
          />
          <input
            className={styles.main_input}
            type="text"
            placeholder="room id"
            onChange={(e) => this.setState({ roomId: e.target.value })}
            disabled={showSpinner}
          />
          <button
            className={styles.main_button}
            onClick={() => this.handleJoin()}
          >
            {!showSpinner ? 'Join' : <div className={styles.loading_spinner}></div>}
          </button>
        </div>
        <div style={{ display: !showChat ? 'none' : '' }}>
          <ChatPage socket={socket} roomId={roomId} username={userName} />
        </div>
      </div>
    );
  }
}

export default Home;
