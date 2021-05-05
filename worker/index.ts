
//declare let self: ServiceWorkerGlobalScope
import { showReminder } from '../services/notifications';
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
    console.log(reminder);

    showReminder(reminder);
  }
  // Other logic for different tags as needed.
});


async function getReminder(id: string) {
  const reminders = await loadReminders();

  return reminders.find(r => r.id === id);
}

//#endregion


export { }