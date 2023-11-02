import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Textarea } from "./TextArea";
import "./App.css";

enum ConnectionStatus {
  Disconnected,
  Disconnecting,
  Connecting,
  Connected,
}

function App() {
  const [socketUrl, setSocketUrl] = useState("192.168.4.1");
  const [websocket, setWebsocket] = useState<null | WebSocket>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.Disconnected
  );
  const [messageBuffer, setMessageBuffer] = useState<string>("");

  useEffect(() => {
    if (websocket === null) return;

    // Thank you websocket api for boxing me into this insane workaround
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
  }, [websocket]);

  function initWebSocket() {
    setConnectionStatus(ConnectionStatus.Connecting);
    const gateway = "ws://" + socketUrl + ":81/";

    console.log("Gateway is: " + gateway);
    setWebsocket(() => {
      return new WebSocket(gateway);
    });
  }

  function closeWebSocket() {
    setConnectionStatus(ConnectionStatus.Disconnecting);
    setMessageBuffer("");
    websocket?.close();
  }

  function onOpen(event: Event) {
    setConnectionStatus(ConnectionStatus.Connected);
    websocket?.send("Hello From Client!");
  }

  function onClose(event: Event) {
    setConnectionStatus(ConnectionStatus.Disconnected);
  }

  interface WSEvent {
    data: string;
  }

  function onMessage(event: WSEvent) {
    console.log(event.data);
    setMessageBuffer((prev) => prev + event.data);
  }

  // TODO: show gateway and ip to user, show messages to user, allow led toggle switch
  // BUG: websocket doesn't close correctly when closed is called for whatever reason (means we can't reconnect after disconnecting)
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
            <p>From Arduino: </p>
            <Textarea minRows={3} value={messageBuffer} />
            <Button onClick={() => closeWebSocket()}>Disconnect</Button>
          </div>
        )
      )}
    </div>
  );
}

export default App;
