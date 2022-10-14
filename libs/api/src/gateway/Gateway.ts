import { ws } from '../utils/core';
import ReconnectingWebSocket from 'reconnecting-websocket';

let socket: ReconnectingWebSocket;
export function connectGateway() {
  if (socket != null) return;
  socket = new ReconnectingWebSocket(ws);

  socket.onopen = () => {
    console.log('Connected to Omagize Gateway');
  };

  socket.onmessage = (event: MessageEvent<GatewayEvent<unknown>>) => {
    console.log(`[message] Data received from server: ${event.data}`);
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(
        `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      console.log('[close] Connection died');
    }
  };

  socket.onerror = (error) => {
    alert(`[error] ${error}`);
  };
}

export type GatewayEvent<T> = {
  op: number;
  d: T;
  type?: string;
};
