import { useEffect, useRef, useState } from 'react';

import { FormGroup } from '../components/form-group';
import { Reminder } from '../models';


export function ReminderForm({ reminder, onChange }: { reminder?: Reminder, onChange: (record: Reminder) => void }) {

	const nameInputEl = useRef<HTMLInputElement>(null);

	const [name, setName] = useState(reminder?.name ?? '');
	const [message, setMessage] = useState(reminder?.message ?? '');
	const [url, setUrl] = useState(reminder?.url ?? '');
	const [interval, setInterval] = useState(reminder?.interval ?? 0);

	useEffect(() => {
		setName(reminder?.name ?? '');
		setMessage(reminder?.message ?? '');
		setUrl(reminder?.url ?? '');
		setInterval(reminder?.interval ?? 0);

		nameInputEl?.current?.focus();
	}, [reminder]);

	useEffect(() => {
		if (!reminder) return;
		onChange({ id: reminder.id, name, message, url, interval });
	}, [name, message, url, interval]);
	

	if (!reminder?.id) {
		return <p>Select a reminder on the left!</p>;
	}
	
	return <form>
		<input type="hidden" name="id" value={reminder?.id} />
		<FormGroup ref={nameInputEl} label="Name" type="text" disabled={!reminder?.id} value={name} change={name => setName(name)} />
		<FormGroup label="Message" type="text" disabled={!reminder?.id} value={message} change={message => setMessage(message)} />
		<FormGroup label="URL" type="url" disabled={!reminder?.id} value={url} change={url => setUrl(url)} />
		<FormGroup label="Interval" type="number" disabled={!reminder?.id} value={interval} change={interval => setInterval(interval)} />
	</form>;
}