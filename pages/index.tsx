import { useEffect, useState, MouseEvent } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

import { useRecordsState } from '../hooks/records-state';

import { Record } from '../models';
import { RecordForm } from '../components/record-form';
import { RecordList } from '../components/record-list';

export default function IndexPage() {

	const { records, addRecord, updateRecord, removeRecord } = useRecordsState([]);
	const [activeRecord, setActiveRecord] = useState<Record>(null);

	function addAndActivateRecord(record: Record) {
		addRecord(record);
		setActiveRecord(record);
	}

	function deleteUpdateActive(record: Record) {
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
				<RecordList {...{records, activeRecord, selectRecord: setActiveRecord, newRecord: addAndActivateRecord, deleteRecord: deleteUpdateActive}} />
			</Col>
			<Col>
				<RecordForm record={activeRecord} onChange={updateRecord} />
			</Col>
		</Row>
	</>;
}

