import { getToken, onMessage } from 'firebase/messaging';
import { firebase } from './firebase';

getToken(firebase.messaging, {
  vapidKey:
    'BCi2YcfIWvkPn67wWyMDok6HW1qEpaKSyjkBsqfhVL-vXgctPeGBlnkTtxQjuP-DUg1sZZoxk8rWHJ_nu3b0RWI',
});

export class FirebaseMessaging {
  /**
   * @returns true if success
   */
  static async requestPermission(): Promise<boolean> {
    console.log('Requesting permission...');
    const permission = await Notification.requestPermission();
    const success = permission === 'granted';

    if (success) {
      console.log('Notification permission granted.');
    } else {
      console.log('denied');
    }
    return success;
  }
}
