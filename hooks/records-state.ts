import { Reminder } from '../models';
import { useReminderStorage } from '../services/storage';
import { updatePeriodicSync } from '../services/sync';


export function useRemindersState(initialValue: Reminder[]) {
	const [reminders, setReminders, { loading, error }] = useReminderStorage(initialValue);

	function updateReminder(reminder: Reminder) {
		const index = reminders.findIndex(r => r.id === reminder.id);
		if (index < 0) return;
		updatePeriodicSync(reminder);
		setReminders([...reminders.slice(0, index), reminder, ...reminders.slice(index + 1)]);
	}

	function addReminder(reminder: Reminder) {
		setReminders([...reminders, reminder]);
	}

	function removeReminder(reminder: Reminder) {
		setReminders(reminders.filter(r => r.id !== reminder.id))
	}

	return { reminders, loading, error, addReminder, updateReminder, removeReminder };
}

