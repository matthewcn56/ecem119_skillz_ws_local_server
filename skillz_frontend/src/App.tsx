import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./App.css";

enum ConnectionStatus {
  Disconnected,
  Connecting,
  Connected,
}

function App() {
  const [socketUrl, setSocketUrl] = useState("");
  const [websocket, setWebsocket] = useState<null | WebSocket>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.Disconnected
  );

  function initWebSocket() {
    console.log("Opening a WebSocket connection...");
    setConnectionStatus(ConnectionStatus.Connecting);
    const gateway = "ws://" + socketUrl + ":81/";

    console.log("Gate way is: " + gateway);
    setWebsocket(() => {
      const newSocket = new WebSocket(gateway);
      newSocket.onopen = onOpen;
      newSocket.onclose = onClose;
      newSocket.onmessage = onMessage;
      return newSocket;
    });
  }

  function onOpen(event: Event) {
    setConnectionStatus(ConnectionStatus.Connected);
    websocket?.send("Hello From Client!");
  }

  function onClose(event: Event) {
    setConnectionStatus(ConnectionStatus.Disconnected);
    console.log("Connection closed");
  }

  interface WSEvent {
    data: string;
  }

  function onMessage(event: WSEvent) {
    console.log("Data is: " + event.data);
  }

  // const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  // const [messageHistory, setMessageHistory] = useState<string[]>([]);
  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     setMessageHistory((prev) => prev.concat(lastMessage.data));
  //   }
  // }, [lastMessage, setMessageHistory]);

  // const handleClickChangeSocketUrl = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) =>
  //     setSocketUrl(e.target.value),
  //   []
  // );

  return (
    <div className="App">
      <p className="connection-status">{ConnectionStatus[connectionStatus]}</p>

      {connectionStatus === ConnectionStatus.Disconnected ? (
        <div className="connection-prompt">
          <TextField
            sx={{ mb: "1rem" }}
            label="Enter Your Websocket URL Here"
            type="text"
            value={socketUrl}
            variant="outlined"
            onChange={(e) => {
              setSocketUrl(e.target.value);
            }}
            fullWidth
          />
          <Button variant="outlined" onClick={() => initWebSocket()}>
            Connect
          </Button>
        </div>
      ) : (
        connectionStatus === ConnectionStatus.Connected && (
          <div className="connection-manager">
            <p>Messages: </p>
            <Button>Disconnect</Button>
          </div>
        )
      )}
    </div>
  );
}

export default App;
