import React from 'react';

const CustomInputComponent = ({
	field: { value, ...field }, // { name, value, onChange, onBlur }
	form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
	...props
}) => {
	return (
		<div>
			<input type="text" {...field} {...props} value={value || ''} />
			{touched && touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
		</div>
	);
};

export { CustomInputComponent };
