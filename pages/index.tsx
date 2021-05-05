import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Reminder } from '../models';
import { RecordList } from '../components/reminder-list';
import { ReminderForm } from '../components/reminder-form';
import { useRemindersState } from '../hooks/reminders-state';
import { useNotifications } from '../hooks/use-notifications';

export default function IndexPage() {

	useNotifications();

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

	const content = error ? <Col><pre>{error.toString()}</pre></Col>
		: loading ? <Col><p>Loading...</p></Col>
			: <>
				<Col>
					<RecordList {...{reminders: reminders, activeReminder: activeReminder, selectReminder: setActiveReminder, newReminder: addAndActivateReminder, deleteReminder: deleteUpdateActive}} />
				</Col>
				<Col>
					<ReminderForm reminder={activeReminder} onChange={updateReminder} />
				</Col>
			</>;

	return <>
		<Row>
			{content}
		</Row>
	</>;
}

