import { useEffect, useState, MouseEvent } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

import { Record } from '../models';
import { guid } from '../services/guid';

export type RecordEvent = (record: Record) => void;

export function RecordList({ records, activeRecord, selectRecord, deleteRecord, newRecord }: {records: Record[], activeRecord: Record, selectRecord: RecordEvent, deleteRecord: RecordEvent, newRecord: RecordEvent }) {
	
	return <ListGroup suppressHydrationWarning>
		{records.map(record => {
			const isActive = record.id === activeRecord?.id;
			return <ListGroup.Item as={'div'} variant={isActive ? 'success' : ''} key={record.id} action={!isActive} onClick={() => selectRecord(record)}>
				<div className="d-flex w-100 justify-content-between">
					<h5 className="mb-1">{record.name}</h5>
					<small>
						<Button variant="outline-danger" type="button" onClick={e => deleteButDontSelect(e, record)}>X</Button>
					</small>
				</div>
				<p className="mb-1">{record.message}</p>
				<small>{record.url}</small>
			</ListGroup.Item>
		})}
		<ListGroup.Item action onClick={() => newRecord({ ...blankRecord(), id: guid() })} style={{ textAlign: 'center' }}>+ Add New Record</ListGroup.Item>
	</ListGroup>;

	function deleteButDontSelect(e: MouseEvent, record: Record) {
		e.stopPropagation();
		deleteRecord(record);
	}
}

function blankRecord(): Record {
	return {
		id: '',
		name: '',
		url: '',
		message: '',
		interval: 0
	}
}