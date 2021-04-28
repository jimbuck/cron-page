export interface Record {
	id?: string;
	name?: string;
	message?: string;
	url?: string;
	interval?: number;
}

export const SYNC_TAG_PREFIX = 'reminder-';

export function getRecordSyncTag(record: Record) {
	return SYNC_TAG_PREFIX + record.id;
}