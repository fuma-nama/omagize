import {
  client,
  closeGateway,
  connectGateway,
  firebase,
  GatewayListener,
  onSignin,
  ReadyPayload,
} from '@omagize/api';
import { applyReadyPayload, useUserStore, useChatStore } from '@omagize/data-access-store';
import { Auth } from 'firebase/auth';
import { useEffect } from 'react';
import { CloseEvent, ErrorEvent } from 'reconnecting-websocket/dist/events';
import { handleEvent } from './handler';

const listeners: Set<Partial<GatewayListener>> = new Set();
const RootListener: GatewayListener = {
  onReady(payload: ReadyPayload): void {
    applyReadyPayload(payload);

    for (const listener of listeners) {
      if (listener.onReady) listener.onReady(payload);
    }
  },
  onMessage: handleEvent,
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

async function resetCache() {
  await onSignin(null); //logout to login page
  //start clearing unused cache
  await client.resetQueries();

  useUserStore.getState().reset();
  useChatStore.getState().reset();
}

export function initGateway(auth: Auth) {
  firebase.auth.beforeAuthStateChanged((next) => {
    const prev = firebase.auth.currentUser;

    if (prev != null && next == null) {
      console.log('Closing Gateway connection');
      closeGateway();

      console.log('Clear cache on logout');
      resetCache();
      return;
    }
  });

  auth.onAuthStateChanged((user) => {
    if (user != null) {
      connectGateway(user, RootListener);
      console.log('Reconnect to Gateway after update auth state');
    }
  });
}
