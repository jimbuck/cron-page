import createPersistedStateHook from 'use-persisted-state';

import { Record } from '../models'

const _useRecordsState = createPersistedStateHook('records');

export function useRecordsState(initialValue: Record[]) {
	const [records, setRecords] = _useRecordsState<Record[]>(initialValue);


	function updateRecord(record: Record) {
		const index = records.findIndex(r => r.id === record.id);
		setRecords([...records.slice(0, index), record, ...records.slice(index + 1)]);
	}

	function addRecord(record: Record) {
		setRecords([...records, record]);
	}

	function removeRecord(record: Record) {
		setRecords(records.filter(r => r.id !== record.id))
	}

	return { records, addRecord, updateRecord, removeRecord };
}