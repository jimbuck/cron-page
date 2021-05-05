import { Reminder } from '../models';

export async function showReminder(registration: ServiceWorkerRegistration, reminder: Reminder) {
	console.log(`Showing notification for reminder ${reminder.name}...`, reminder);
	if (Notification.permission !== 'granted') {
		const result = confirm(`${reminder.name}:

${reminder.message}`);
		if (result) window.open(reminder.url, '_blank');
		return;
	}

	await registration.showNotification(reminder.message, {
		icon: '/icons/clock-128.png',
		data: reminder,
		requireInteraction: true
	});
}

