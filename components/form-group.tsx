import { forwardRef, Ref } from 'react';
import { guid } from '../services/guid';

type FormGroupProps<TValue> = { label: string, disabled: boolean, placeholder?: string, ref?: Ref<HTMLInputElement>, value: TValue, change: (value: TValue) => void };
type StringFormGroupProps = { type: 'text' | 'url' } & FormGroupProps<string>;
type NumberFormGroupProps = { type: 'number' } & FormGroupProps<number>;

function FormGroupRaw({ label, type, disabled, placeholder, value, change }: StringFormGroupProps|NumberFormGroupProps, ref: Ref<HTMLInputElement>) {
	const inputId = 'input_' + guid();

	return <div className="form-group row">
		<label htmlFor={inputId} className="col-sm-2 col-form-label">{label}</label>
		<div className="col-sm-10">
			<input type={type} className="form-control" id={inputId} placeholder={placeholder} disabled={disabled} value={value} onChange={e => (change as (val: unknown) => void)(e.target.value)} ref={ref} />
		</div>
	</div>;
}

export const FormGroup = forwardRef(FormGroupRaw);