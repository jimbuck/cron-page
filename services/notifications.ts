import { Reminder } from '../models';



export async function showReminder(reminder: Reminder) {

	if (Notification.permission !== 'granted') {
		const result = confirm(`${reminder.name}:

${reminder.message}`);
		if (result) window.open(reminder.url, '_blank');
		return;
	}

	const notification = new Notification(reminder.name, {
		body: reminder.message,
		data: reminder,
	});

	notification.onclick = () => window.open(reminder.url, '_blank');
}