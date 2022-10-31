import { firebase } from './../firebase/firebase';
import { ws } from '../utils/core';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { handleGateway } from './GatewayHandler';

let socket: ReconnectingWebSocket;

export type GatewayOptions = {
  /**
   * Enable debugs logs
   */
  debug?: boolean;
};

export const Gateway = {
  isConnected(): boolean {
    return socket?.readyState === ReconnectingWebSocket.OPEN;
  },
  getSocket(): ReconnectingWebSocket {
    return socket;
  },
  async connect(options: GatewayOptions) {
    const user = firebase.auth.currentUser;
    if (user == null) throw new Error('User cannot be null');

    const token = await user.getIdToken();
    connectGateway(token, options);
    return socket;
  },
};

function connectGateway(token: string, options: GatewayOptions) {
  if (socket != null) return;

  const params = new URLSearchParams({
    token: token,
  });
  socket = new ReconnectingWebSocket(`${ws}?${params}`);
  socket.onopen = () => {
    console.log('Connected to Omagize Gateway');
  };

  socket.onmessage = (event: MessageEvent<string>) => {
    if (event.data.length !== 0) {
      handleGateway(event.data);
    }
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
}

export type GatewayEvent<T> = {
  op: number;
  d: T;
  type?: string;
};
