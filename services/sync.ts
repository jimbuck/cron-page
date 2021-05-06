import { Reminder, getReminderSyncTag  } from '../models'

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

export async function updatePeriodicSync(reminder: Reminder) {
	if (!reminder || !(reminder.id && reminder.interval && reminder.message)) return;

	const registration: any = await navigator.serviceWorker.ready;
	if ('periodicSync' in registration) {
		try {
			const reminderTag = await deletePeriodicSync(reminder);
			
			await registration.periodicSync.register(reminderTag, {
				minInterval: 1000 * 60 * reminder.interval, // Convert from minutes to milliseconds
			});
			console.log(`PeriodicSync updated for ${reminder.name}!`);
		} catch (error) {
			console.error(error);
		}
	} else {
		console.error(`'periodicSync' NOT in registration`, reminder);
	}
}

export async function deletePeriodicSync(reminder: Reminder) {
	const reminderTag = getReminderSyncTag(reminder);
	const registration: any = await navigator.serviceWorker.ready;

	const tags: string[] = await registration.periodicSync.getTags();

	if (tags.includes(reminderTag)) await registration.periodicSync.unregister(reminderTag);

	return reminderTag;
}


const reminderIntervals: Record<string, NodeJS.Timeout> = {};
export async function updateIntervals(reminder: Reminder) {
	const intervalHandle = reminderIntervals[reminder.id];
	if (typeof intervalHandle === 'number') clearInterval(intervalHandle);

	reminderIntervals[reminder.id] = setInterval(async () => {
		const registration = await navigator.serviceWorker.ready;
		registration.active.postMessage({ message: 'show-notification', reminder });
	}, Math.max(reminder.interval * MINUTES, 15 * SECONDS));
}

export function deleteInterval(reminder: Reminder) {
	const intervalHandle = reminderIntervals[reminder.id];
	if (typeof intervalHandle === 'number') clearInterval(intervalHandle);
	delete reminderIntervals[reminder.id];
}



export function updateTimers(reminder: Reminder) {
	if (!reminder || !(reminder.id && reminder.interval && reminder.message)) return;

	console.log(`Setting up timer for ${reminder.name}`);

	updateIntervals(reminder);
	updatePeriodicSync(reminder);
}

export function removeTimer(reminder: Reminder) {
	if (!reminder || !reminder.id) return;
	
	console.log(`Deleting timer ${reminder.name ?? reminder.id}...`);

	deleteInterval(reminder);
	deletePeriodicSync(reminder);
}