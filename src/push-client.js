import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// Native Android only. Never put FCM service account secrets in this project.
if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
  const topbar = document.querySelector('.top');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'admin';
  button.textContent = '🔔 Enable notifications';
  button.style.marginLeft = 'auto';
  const hint = document.createElement('p');
  hint.setAttribute('role', 'status');
  hint.className = 'small';
  hint.style.textAlign = 'center';
  hint.style.margin = '8px 0';
  topbar?.append(button);
  topbar?.insertAdjacentElement('afterend',hint);

  PushNotifications.addListener('registration', ({value}) => {
    // FCM DEVICE TOKEN: copy from Android Studio Logcat for Firebase Console test.
    // No automatic central registration exists yet; backend must handle that securely.
    console.info('Star Skin FCM registration token:', value);
    hint.textContent = '✓ Notifications enabled. Device registered with Firebase.';
    try { localStorage.setItem('starSkinFcmToken', value); } catch {}
  });
  PushNotifications.addListener('registrationError', (err) => {
    hint.textContent = 'Notification registration failed. Check Firebase configuration.';
    console.error('FCM registration error',err);
  });
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    hint.textContent = '🔔 ' + (notification.title || 'New announcement');
    // The existing announcements list can refresh after a push while the app is open.
    document.dispatchEvent(new Event('visibilitychange'));
  });
  PushNotifications.addListener('pushNotificationActionPerformed', () => {
    location.href = 'index.html';
  });
  button.addEventListener('click', async () => {
    try {
      let status = await PushNotifications.checkPermissions();
      if (status.receive === 'prompt') status = await PushNotifications.requestPermissions();
      if (status.receive !== 'granted') {
        hint.textContent = 'Notifications permission denied. Enable it in Android Settings.';
        return;
      }
      hint.textContent = 'Registering this device…';
      await PushNotifications.register();
    } catch (e) {
      hint.textContent = 'Could not register for notifications.';
      console.error(e);
    }
  });
}
