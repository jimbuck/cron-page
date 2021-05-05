declare const self: ServiceWorkerGlobalScope;

import { Reminder } from '../models';
import { showReminder } from './notifications';
import { loadReminders } from '../services/storage';

//#region Install

self.addEventListener('install', async event => {
  console.log('Hello world from the Service Worker 🤙');

  const status = await navigator.permissions.query({ name: 'periodic-background-sync' as PermissionName });
  if (status.state === 'granted') {
    console.log(`Periodic sync is supported!`);
  } else {
    console.warn(`Periodic sync is not supported!`, status);
  }
});

//#endregion


//#region Periodic Sync

self.addEventListener('periodicsync', async (event) => {
  console.log(`PERIODIC SYNC (${event.tag})`, event);
  if (event.tag.startsWith('reminder-')) {
    const reminder = await getReminder(event.tag.replace('reminder-', ''));

    event.waitUntil(
      showReminder((self as any).registration, reminder)
    );
  }
  // Other logic for different tags as needed.
});

async function getReminder(id: string) {
  const reminders = await loadReminders();

  return reminders.find(r => r.id === id);
}

//#endregion

//#region Notifications

self.addEventListener('message', async (event) => {
  const { message, reminder }: { message: 'test-notification', reminder: Reminder } = event.data;
  
  if (message === 'test-notification') {
    await showReminder((self as any).registration, reminder)
  }
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();

	const reminder: Reminder = event.notification.data;

	event.waitUntil(
		self.clients.openWindow(reminder.url).then(windowClient => windowClient?.focus())
	);
});

//#endregion

export { }