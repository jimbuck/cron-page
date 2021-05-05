import { get, set } from 'idb-keyval';
import { useEffect, useState } from 'react';
import { Reminder } from '../models';

const reminderKey = 'reminders';

export async function loadReminders(): Promise<Reminder[]> {
	const reminders = await get<Reminder[]>(reminderKey);
	return reminders ?? [];
}

export async function saveReminders(reminders: Reminder[] | null | undefined): Promise<Reminder[]> {
	reminders ??= [];
	await set(reminderKey, reminders);
	return reminders;
}

export const useReminderStorage = createStorageHook(reminderKey, [] as Reminder[]);

export function createStorageHook<T>(key: string, initialValue?: T) {
	return function useStorage(value?: T) {
		const [loading, setLoading] = useState(false);
		const [data, setData] = useState(value ?? initialValue);
		const [error, setError] = useState<Error|undefined>();
	
		useEffect(() => {
			loadData();
		}, []);
	
		return [data, saveData, { loading, error }] as const;
		
		function loadData() {
			(async () => {
				try {
					setLoading(true);
					const value = await get(key);
					await delay(2000);
					setLoading(false);
					setData(value ?? initialValue);
				} catch (error) {
					console.error(error);
					setError(error);
					setLoading(false);
				}
			})();
		}

		function saveData(value: T) {
			(async () => {
				try {
					await set(key, value);
					setData(value);
				} catch (error) {
					console.error(error);
					setError(error);
					setLoading(false);
				}
			})();
		}
	}
}

function delay(time: number) {
	return new Promise(resolve => setTimeout(resolve, time));
}