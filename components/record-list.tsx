import { useEffect, useState, MouseEvent } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

import { Reminder } from '../models';
import { guid } from '../services/guid';

export type ReminderEvent = (reminder: Reminder) => void;

export function RecordList({ reminders, activeReminder, selectReminder, deleteReminder, newReminder }: {reminders: Reminder[], activeReminder: Reminder, selectReminder: ReminderEvent, deleteReminder: ReminderEvent, newReminder: ReminderEvent }) {
	
	return <ListGroup suppressHydrationWarning>
		{reminders.map(reminder => {
			const isActive = reminder.id === activeReminder?.id;
			return <ListGroup.Item as={'div'} variant={isActive ? 'success' : ''} key={reminder.id} action={!isActive} onClick={() => selectReminder(reminder)}>
				<div className="d-flex w-100 justify-content-between">
					<h5 className="mb-1">{reminder.name}</h5>
					<small>
						<Button variant="outline-danger" type="button" onClick={e => deleteButDontSelect(e, reminder)}>X</Button>
					</small>
				</div>
				<p className="mb-1">{reminder.message}</p>
				<small>{reminder.url}</small>
			</ListGroup.Item>
		})}
		<ListGroup.Item action onClick={() => newReminder({ ...blankReminder(), id: guid() })} style={{ textAlign: 'center' }}>+ Add New Record</ListGroup.Item>
	</ListGroup>;

	function deleteButDontSelect(e: MouseEvent, reminder: Reminder) {
		e.stopPropagation();
		deleteReminder(reminder);
	}
}

function blankReminder(): Reminder {
	return {
		id: '',
		name: '',
		url: '',
		message: '',
		interval: 0
	}
}