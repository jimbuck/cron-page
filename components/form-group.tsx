import { guid } from '../services/guid';


export function FormGroup({ label, type, disabled, placeholder, value, change }: { label: string, type: 'text' | 'number' | 'url', disabled: boolean, placeholder?: string, value: number, change: (value: number) => void });
export function FormGroup({ label, type, disabled, placeholder, value, change }: { label: string, type: 'text' | 'number' | 'url', disabled: boolean, placeholder?: string, value: string, change: (value: string) => void });
export function FormGroup({ label, type, disabled, placeholder, value, change }: { label: string, type: 'text' | 'number' | 'url', disabled: boolean, placeholder?: string, value: string | number, change: (value: string|number) => void }) {
	const inputId = 'input_' + guid();

	return <div className="form-group row">
		<label htmlFor={inputId} className="col-sm-2 col-form-label">{label}</label>
		<div className="col-sm-10">
			<input type={type} className="form-control" id={inputId} placeholder={placeholder} disabled={disabled} value={value} onChange={e => change(e.target.value)} />
		</div>
	</div>;
}