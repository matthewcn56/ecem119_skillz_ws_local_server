import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [socketUrl,setSocketUrl] = useState("");
  const [websocket, setWebsocket] = useState<null | WebSocket>(null);
  useEffect(() => {
    console.log(websocket);
  }, [websocket]);

  function initWebSocket() {
    console.log("Opening a WebSocket connection...");
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
    console.log("Socket connection opened!");
  }

  function onClose(event: Event) {
    console.log("Connection closed");
    //TODO: PUT BACK IN
    //attempt to try connecting again
    setTimeout(initWebSocket, 2000);
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Enter Your Websocket URL Here:
        </p>
        <input type="text" value={socketUrl}
        onChange={(e) => {
          setSocketUrl(e.target.value)
        }}
        />
        <button onClick={() => initWebSocket()}>Hullo</button>
      </header>
    </div>
  );
}

export default App;
