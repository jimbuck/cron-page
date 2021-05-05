import { Record, getRecordSyncTag  } from '../models'

if (process.browser) {
	navigator.serviceWorker.onmessage = event => {

		if (event.data.tag.startsWith('reminder-')) {
			const record = getRecord(event.data.tag.replace('reminder-', ''));
			console.log(record);
	
		}
		// Other logic for different tags as needed.
	};
}

export async function updatePeriodicSync(record: Record) {
	if (!record || !(record.id && record.interval && record.message)) return;

	const registration: any = await navigator.serviceWorker.ready;
	if ('periodicSync' in registration) {
		try {
			const recordTag = getRecordSyncTag(record);
			const tags: string[] = await registration.periodicSync.getTags();

			if (tags.includes(recordTag)) await unregisterSync(recordTag);
			
			await registerSync(recordTag);
		} catch (error) {
			console.error(error);
		}
	} else {
		console.error(`'periodicSync' NOT in registration`, record);
	}


	async function unregisterSync(tag: string) {
		await registration.periodicSync.unregister(tag);
		
	}
	
	async function registerSync(tag: string) {
		await registration.periodicSync.register(tag, {
			minInterval: record.interval,
		});
	}
}

function getRecord(id: string) {
  const records = localStorage['records'] || [];

  return records.find(r => r.id === id);
}

