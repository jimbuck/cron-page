import { Reminder, getReminderSyncTag  } from '../models'

export async function updatePeriodicSync(reminder: Reminder) {
	if (!reminder || !(reminder.id && reminder.interval && reminder.message)) return;

	const registration: any = await navigator.serviceWorker.ready;
	if ('periodicSync' in registration) {
		try {
			const reminderTag = getReminderSyncTag(reminder);
			const tags: string[] = await registration.periodicSync.getTags();

			if (tags.includes(reminderTag)) await unregisterSync(reminderTag);
			
			await registerSync(reminderTag);
			console.log(`PeriodicSync updated for ${reminder.name}!`);
		} catch (error) {
			console.error(error);
		}
	} else {
		console.error(`'periodicSync' NOT in registration`, reminder);
	}


	async function unregisterSync(tag: string) {
		await registration.periodicSync.unregister(tag);
		
	}
	
	async function registerSync(tag: string) {
		await registration.periodicSync.register(tag, {
			minInterval: reminder.interval,
		});
	}
}

