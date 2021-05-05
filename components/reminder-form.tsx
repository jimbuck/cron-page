import { useEffect, useRef, useState } from 'react';

import { FormGroup } from './form-group';
import { Reminder } from '../models';


export function ReminderForm({ reminder, onChange }: { reminder?: Reminder, onChange: (reminder: Reminder) => void }) {

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

	if (!reminder?.id) {
		return <p>Select a reminder on the left!</p>;
	}
	
	return <form>
		<input type="hidden" name="id" value={reminder?.id} />
		<FormGroup ref={nameInputEl} label="Name" type="text" disabled={!reminder?.id} value={name} change={name => { setName(name); onChange({...reminder, name}) }} />
		<FormGroup label="Message" type="text" disabled={!reminder?.id} value={message} change={message => { setMessage(message); onChange({...reminder, message}) }} />
		<FormGroup label="URL" type="url" disabled={!reminder?.id} value={url} change={url => { setUrl(url); onChange({...reminder, url}) }} />
		<FormGroup label="Interval" type="number" disabled={!reminder?.id} value={interval} change={interval => { setInterval(interval); onChange({...reminder, interval}) }} />
	</form>;
}