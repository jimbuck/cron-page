import { useEffect, useState, MouseEvent } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

import { useRemindersState } from '../hooks/records-state';

import { Reminder } from '../models';
import { ReminderForm } from '../components/record-form';
import { RecordList } from '../components/record-list';

export default function IndexPage() {

	const { reminders, loading, error, addReminder, updateReminder, removeReminder } = useRemindersState([]);
	const [activeReminder, setActiveReminder] = useState<Reminder>(null);

	function addAndActivateReminder(record: Reminder) {
		addReminder(record);
		setActiveReminder(record);
	}

	function deleteUpdateActive(record: Reminder) {
		removeReminder(record);
		if (record.id === activeReminder?.id) {
			setActiveReminder({})
		}
	}

	if (error) {
		return <>
			<Row>
				<Col>
					<h2>Welcome!</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<pre>{error.toString()}</pre>
				</Col>
			</Row>
		</>;
	}

	if (loading) {
		return <>
			<Row>
				<Col>
					<h2>Welcome!</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<p>Loading...</p>
				</Col>
			</Row>
		</>;
	}

	return <>
		<Row>
			<Col>
				<h2>Welcome!</h2>
			</Col>
		</Row>
		<Row>
			<Col>
				<RecordList {...{reminders: reminders, activeReminder: activeReminder, selectReminder: setActiveReminder, newReminder: addAndActivateReminder, deleteReminder: deleteUpdateActive}} />
			</Col>
			<Col>
				<ReminderForm reminder={activeReminder} onChange={updateReminder} />
			</Col>
		</Row>
	</>;
}

