import {
  GatewayListener,
  Keys,
  ReadyPayload,
  startGateway,
  useLoginQuery,
} from '@omagize/api';
import { useQuery } from '@tanstack/react-query';
import { Auth } from 'firebase/auth';
import { useEffect } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { CloseEvent, ErrorEvent } from 'reconnecting-websocket/dist/events';

const listeners: Set<Partial<GatewayListener>> = new Set();
const RootListener: GatewayListener = {
  onReady(payload: ReadyPayload): void {
    for (const listener of listeners) {
      if (listener.onReady) listener.onReady(payload);
    }
  },
  onClose(event: CloseEvent): void {
    for (const listener of listeners) {
      if (listener.onClose) listener.onClose(event);
    }
  },
  onError(error: ErrorEvent): void {
    for (const listener of listeners) {
      if (listener.onError) listener.onError(error);
    }
  },
};

export function useGatewayListener(listener: Partial<GatewayListener>) {
  useEffect(() => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);
}

export function initGateway(auth: Auth) {
  auth.onAuthStateChanged((user) => {
    console.log('refresh');
  });
}

export function useGatewayQuery() {
  const login = useLoginQuery();

  return useQuery<ReconnectingWebSocket>(
    Keys.ws.connect,
    () => startGateway(RootListener),
    {
      enabled: login.isSuccess,
    }
  );
}
