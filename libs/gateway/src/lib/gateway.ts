import ReconnectingWebSocket, { CloseEvent, ErrorEvent } from 'reconnecting-websocket';
import { GatewayMessage, IdentityEvent, OpCode, ReadyPayload, RawReadyPayload } from './messages';
import { User } from 'firebase/auth';

export const ws = import.meta.env.WS;

export interface GatewayListener {
  onReady: (payload: ReadyPayload) => void;
  /**
   * Not including onReady event
   */
  onMessage: (message: GatewayMessage<unknown>) => void;
  onClose: (event: CloseEvent) => void;
  onError: (error: ErrorEvent) => void;
}

export let websocket: ReconnectingWebSocket;
export function connectGateway(user: User, listener: GatewayListener) {
  if (websocket != null) {
    websocket.close();
  }
  const socket = (websocket = new ReconnectingWebSocket(ws));

  socket.onopen = () => {
    user
      .getIdToken()
      .then((token) => {
        const message = IdentityEvent(token);

        socket.send(JSON.stringify(message));
      })
      .catch((e) => {
        console.log(e);
        socket.close();
      });
    console.log('[Gateway] Identity Started');
  };

  socket.onmessage = (e: MessageEvent<string>) => {
    if (e.data.length === 0) return;
    const message: GatewayMessage<unknown> = JSON.parse(e.data);

    switch (message.op) {
      case OpCode.Dispatch: {
        listener.onMessage(message);
        break;
      }
      case OpCode.Ready: {
        const payload = ReadyPayload(message.d as RawReadyPayload);
        console.log('Connected to Omagize Gateway');

        listener.onReady(payload);
        break;
      }
      default:
        console.log(`[Gateway] unknown op code ${message.op}`);
    }
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      console.log('[close] Connection died');
    }

    listener.onClose(event);
  };

  socket.onerror = (error) => {
    console.log(`[error] ${error}`, error);

    listener.onError(error);
  };

  return socket;
}

export function closeGateway() {
  websocket?.close();
}
