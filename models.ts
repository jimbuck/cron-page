export interface Reminder {
	id?: string;
	name?: string;
	message?: string;
	url?: string;
	interval?: number;
}

export const SYNC_TAG_PREFIX = 'reminder-';

export function getRecordSyncTag(record: Reminder) {
	return SYNC_TAG_PREFIX + record.id;
}