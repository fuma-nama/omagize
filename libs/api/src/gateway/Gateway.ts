import { ws } from '../utils/core';
import ReconnectingWebSocket from 'reconnecting-websocket';

let socket: ReconnectingWebSocket;

export const Gateway = {
  isConnected(): boolean {
    return socket?.readyState === ReconnectingWebSocket.OPEN;
  },
  getSocket(): ReconnectingWebSocket {
    return socket;
  },
  connect(init: (socket: ReconnectingWebSocket) => void) {
    connectGateway(init);
  },
};

function connectGateway(init: (socket: ReconnectingWebSocket) => void) {
  if (socket != null) return;
  socket = new ReconnectingWebSocket(ws);

  socket.onopen = () => {
    console.log('Connected to Omagize Gateway');
  };

  socket.onmessage = (event: MessageEvent<GatewayEvent<unknown>>) => {
    console.log(`[message] Data received from server: ${event.data}`);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(
        `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      console.log('[close] Connection died');
    }
  };

  socket.onerror = (error) => {
    console.log(`[error] ${error}`, error);
  };

  init(socket);
}

export type GatewayEvent<T> = {
  op: number;
  d: T;
  type?: string;
};
