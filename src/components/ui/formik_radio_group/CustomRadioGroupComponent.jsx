import React from 'react';

// const CustomRadioGroupComponent = ({
// 	field, // { name, value, onChange, onBlur }
// 	form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
// 	...props
// }) => (
// 	<div>
// 		<input type="text" {...field} {...props} />
// 	</div>
// );

const CustomRadioGroupComponent = ({
	field: { name, value, onChange, onBlur },
	form: { touched, errors },
	id,
	label,
	className,
	expected,
	...props
}) => {
	return (
		<div className="radio__group__wrapper">
			<input
				name={name}
				id={id}
				type="radio"
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				checked={value == expected}
				className="radio-button"
				{...props}
			/>
			<label htmlFor={id}>{label}</label>
			{touched && touched[name] && errors[name] && <div className="error">{errors[name]}</div>}
		</div>
	);
};

export { CustomRadioGroupComponent };
