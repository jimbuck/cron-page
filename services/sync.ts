import { Record, getRecordSyncTag  } from '../models'

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

