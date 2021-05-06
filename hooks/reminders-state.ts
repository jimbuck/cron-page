import { useEffect } from 'react';
import { Reminder } from '../models';
import { useReminderStorage } from '../services/storage';
import { updateTimers, removeTimer } from '../services/sync';


export function useRemindersState(initialValue: Reminder[]) {
	const [reminders, setReminders, { loading, error }] = useReminderStorage(initialValue);

	useEffect(() => {
		console.log(`Setting up initial timers...`);
		reminders.forEach(reminder => updateTimers(reminder));
	}, [])

	function updateReminder(reminder: Reminder) {
		const index = reminders.findIndex(r => r.id === reminder.id);
		if (index < 0) return;
		updateTimers(reminder);
		setReminders([...reminders.slice(0, index), reminder, ...reminders.slice(index + 1)]);
	}

	function addReminder(reminder: Reminder) {
		updateTimers(reminder);
		setReminders([...reminders, reminder]);
	}

	function removeReminder(reminder: Reminder) {
		removeTimer(reminder);
		setReminders(reminders.filter(r => r.id !== reminder.id))
	}

	return { reminders, loading, error, addReminder, updateReminder, removeReminder };
}

