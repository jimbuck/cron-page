
//declare let self: ServiceWorkerGlobalScope

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

self.addEventListener('periodicsync', (event) => {
	console.log(`PERIODIC SYNC`);
	if (event.tag.startsWith('reminder-')) {
    const record = getRecord(event.tag.replace('reminder-', ''));
    console.log(record);

  }
  // Other logic for different tags as needed.
});

function getRecord(id) {
  const records = localStorage['records'] || [];

  return records.find(r => r.id === id);
}

//#endregion


export { }