import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

import { useRecordsState } from '../hooks/records-state';
import { FormGroup } from '../components/form-group';
import { guid } from '../services/guid';
import { Record } from '../models';


export default function IndexPage() {

	const { records, addRecord, updateRecord, removeRecord } = useRecordsState([]);
	const [activeRecord, setActiveRecord] = useState<Record>({});

	useEffect(() => {
		if (!activeRecord && records.length > 0) {
			setActiveRecord(records[records.length - 1]);
		}
		console.log(`Active: ${activeRecord?.id}`);
	}, [records.length])

	return <>
		<Row>
			<Col>
				<h2>Welcome!</h2>
			</Col>
		</Row>
		<Row>
			<Col>
				<ListGroup>
					{records.map(record => {
						const isActive = record.id === activeRecord.id;
						return <ListGroup.Item variant={isActive ? 'success' : '' } key={record.id} action={!isActive} onClick={(e) => setActiveRecord(record)}>
							<div className="d-flex w-100 justify-content-between">
								<h5 className="mb-1">{record.name}</h5>
								<small>
									<Button variant="outline-danger" onClick={e => { e.stopPropagation(); removeRecord(record); setActiveRecord({}) }}>X</Button>
								</small>
							</div>
							<p className="mb-1">{record.message}</p>
							<small>{record.url}</small>
						</ListGroup.Item>
					})}
					<ListGroup.Item action onClick={() => addRecord({ id: guid() })} style={{ textAlign: 'center' }}>+ Add New Record</ListGroup.Item>
				</ListGroup>
			</Col>
			<Col>
				<form>
					<input type="hidden" name="id" value={activeRecord?.id} />
					<FormGroup label="Name" type="text" disabled={!activeRecord.id} value={activeRecord.name} change={name => setActiveRecord({ ...activeRecord, name })} />
					<FormGroup label="Message" type="text" disabled={!activeRecord.id} value={activeRecord.message} change={message => setActiveRecord({ ...activeRecord, message })} />
					<FormGroup label="URL" type="url" disabled={!activeRecord.id} value={activeRecord.url} change={url => setActiveRecord({ ...activeRecord, url })} />
					<FormGroup label="Interval" type="number" disabled={!activeRecord.id} value={activeRecord.interval} change={interval => setActiveRecord({ ...activeRecord, interval })} />
					
					<Row className="form-group">
						<Col sm="10">
							<Button type="button" variant="primary" onClick={() => updateRecord(activeRecord)}>Save</Button>
						</Col>
					</Row>
				</form>
			</Col>
		</Row>
	</>;
}


