import { useEffect, useState, MouseEvent } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

import { useRecordsState } from '../hooks/records-state';
import { guid } from '../services/guid';
import { Record } from '../models';
import { RecordForm } from '../components/record-form';

export default function IndexPage() {

	const { records, addRecord, updateRecord, removeRecord } = useRecordsState([]);
	const [activeRecord, setActiveRecord] = useState<Record>(null);

	function addAndActivateRecord(record: Record) {
		addRecord(record);
		setActiveRecord(record);
	}

	function deleteUpdateUpdateActive(e: MouseEvent<HTMLElement>, record: Record) {
		e.stopPropagation();
		removeRecord(record);
		if (record.id === activeRecord?.id) {
			setActiveRecord({})
		}
	}

	return <>
		<Row>
			<Col>
				<h2>Welcome!</h2>
			</Col>
		</Row>
		<Row>
			<Col>
				<ListGroup suppressHydrationWarning>
					{records.map(record => {
						const isActive = record.id === activeRecord?.id;
						return <ListGroup.Item as={'div'} variant={isActive ? 'success' : '' } key={record.id} action={!isActive} onClick={(e) => setActiveRecord(record)}>
							<div className="d-flex w-100 justify-content-between">
								<h5 className="mb-1">{record.name}</h5>
								<small>
									<Button variant="outline-danger" onClick={e => deleteUpdateUpdateActive(e, record)}>X</Button>
								</small>
							</div>
							<p className="mb-1">{record.message}</p>
							<small>{record.url}</small>
						</ListGroup.Item>
					})}
					<ListGroup.Item action onClick={() => addAndActivateRecord({ ...blankRecord(), id: guid() })} style={{ textAlign: 'center' }}>+ Add New Record</ListGroup.Item>
				</ListGroup>
			</Col>
			<Col>
				<RecordForm record={activeRecord} onChange={updateRecord} />
			</Col>
		</Row>
	</>;
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