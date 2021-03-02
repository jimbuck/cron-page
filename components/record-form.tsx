import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { FormGroup } from '../components/form-group';
import { Record } from '../models';


export function RecordForm({ record, onChange }: { record?: Record, onChange: (record: Record) => void }) {

	const [name, setName] = useState(record?.name ?? '');
	const [message, setMessage] = useState(record?.message ?? '');
	const [url, setUrl] = useState(record?.url ?? '');
	const [interval, setInterval] = useState(record?.interval ?? 0);

	useEffect(() => {
		setName(record?.name ?? '');
		setMessage(record?.message ?? '');
		setUrl(record?.url ?? '');
		setInterval(record?.interval ?? 0);
	}, [record]);
	

	if (!record?.id) {
		return <p>Select a record on the left!</p>;
	}
	
	return <form>
		<input type="hidden" name="id" value={record?.id} />
		<FormGroup label="Name" type="text" disabled={!record?.id} value={name} change={name => setName(name)} autoFocus />
		<FormGroup label="Message" type="text" disabled={!record?.id} value={message} change={message => setMessage(message)} />
		<FormGroup label="URL" type="url" disabled={!record?.id} value={url} change={url => setUrl(url)} />
		<FormGroup label="Interval" type="number" disabled={!record?.id} value={interval} change={interval => setInterval(interval)} />
					
		<Row className="form-group">
			<Col sm="10">
				<Button type="button" variant="primary" onClick={() => onChange({id: record.id, name, message, url, interval})}>Save</Button>
			</Col>
		</Row>
	</form>;
}