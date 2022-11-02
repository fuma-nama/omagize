import { firebase } from './../firebase/firebase';
import { ws } from '../utils/core';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { handleGateway } from './GatewayHandler';
import { GatewayEvent, IdentityEvent, OpCode } from './events';
import { useQuery } from '@tanstack/react-query';
import { Keys } from '../query/queries';
import { client } from '../query';

export function startGateway() {
  const socket = new ReconnectingWebSocket(ws);

  socket.onopen = () => {
    firebase.auth.currentUser
      .getIdToken()
      .then((token) => {
        const message = IdentityEvent(token);

        socket.send(JSON.stringify(message));
        console.log('a');
      })
      .catch((e) => console.log(e));
    console.log('[Gateway] Identity Started');
  };

  socket.onmessage = (e: MessageEvent<string>) => {
    if (e.data.length === 0) return;
    const event: GatewayEvent<unknown> = JSON.parse(e.data);

    switch (event.op) {
      case OpCode.Dispatch: {
        handleGateway(event);
        break;
      }
      case OpCode.Ready: {
        console.log('Connected to Omagize Gateway');
        dispatchGatewayStatus(GatewayStatus.Ready);
        break;
      }
      default:
        console.log(`[Gateway] unknown op code ${event.op}`);
    }
  };

  socket.onclose = (event) => {
    dispatchGatewayStatus(GatewayStatus.Disconnected);
    if (event.wasClean) {
      console.log(
        `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      console.log('[close] Connection died');
    }
  };

  socket.onerror = (error) => {
    dispatchGatewayStatus(GatewayStatus.Disconnected);
    console.log(`[error] ${error}`, error);
  };

  return socket;
}

export enum GatewayStatus {
  Connecting,
  Ready,
  Disconnected,
}

async function dispatchGatewayStatus(status: GatewayStatus) {
  await client.setQueryData(Keys.ws.status, () => status);
}

export function useGatewayStatus() {
  return useQuery<GatewayStatus>(
    Keys.ws.status,
    () => GatewayStatus.Connecting
  );
}
