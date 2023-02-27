import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import DatePicker, { InputField } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import _, { get } from 'lodash';
import styled from 'styled-components';
import moment from 'moment';
import * as Yup from 'yup';
import {
	Modal,
	Button,
	Grid,
	Input,
	Segment,
	Dropdown,
	Icon,
	Message,
	Header,
	TextArea,
	Image,
	Label,
	Checkbox
} from 'semantic-ui-react';
import { productService, alertService } from '@/services';
import { Loading } from '@/components/';
import { ImgUpload } from '@/components/';
import './add-edit.less';

const BorderLessSegment = styled(Segment)`
  border: none !important;
  box-shadow: none !important;
`;

const ZeroPaddingSegment = styled(BorderLessSegment)`
  padding: 0 !important;
  margin: 0 !important;
`;

const FlexColumn = styled(ZeroPaddingSegment)`
  display: flex !important;
  flex-direction: column !important;
`;
const FlexRow = styled(ZeroPaddingSegment)`
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
`;

function AddEdit({ history, match, open, id, onSave, onClose }) {
	const isVisible = useRef(false);
	const [ loading, setLoading ] = useState(false);
	const datePickerRef = useRef(null);
	const endDatePickerRef = useRef(null);
	const expiryPickerRef = useRef(null);
	const initialState = {
		ProductName: '',
		ProductDescription: '',
		Location: '',
		StartDate: '',
		EndDate: '',
		Expiry: '',
		Active: false,
		DeActivate: false,
		CompanyName: '',
		CompanyContact: '',
		CompanyAddressLine1: '',
		CompanyAddressLine2: '',
		CompanyPostCode: '',
		CompanyLandLine: '',
		CompanyMobile: '',
		CompanyEmail: '',
		Notes: '',
		Avatar: '',
		ImgUrl: 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true',
		imagePreviewUrl: 'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true'
	};
	const [ product, setProduct ] = useState(initialState);
	const isAddMode = (id) => id === -1;

	useEffect(
		() => {
			//setId(Id);
			if (id === -1) {
				setProduct(initialState);
			}
			return () => {};
		},
		[ open ]
	);

	const validationSchema = Yup.object().shape({
		ProductName: Yup.string().required('ProductName is required'),
		ProductDescription: Yup.string().required('ProductDescription is required'),
		Location: Yup.string().required('Location is required'),
		StartDate: Yup.date().required('StartDate is required'),
		EndDate: Yup.date().notRequired(),
		Expiry: Yup.date().notRequired(),
		Active: Yup.bool().oneOf([ true, false ]).notRequired(),
		DeActivate: Yup.bool().oneOf([ true, false ]).notRequired(),
		CompanyName: Yup.string().required('CompanyName is required'),
		CompanyContact: Yup.string().required('CompanyContact is required'),
		CompanyAddressLine1: Yup.string().required('CompanyAddressLine1 is required'),
		CompanyAddressLine2: Yup.string().required('CompanyAddressLine2 is required'),
		CompanyPostCode: Yup.string().required('CompanyPostCode is required'),
		CompanyLandLine: Yup.string().required('CompanyLandLine is required'),
		CompanyEmail: Yup.string().required('CompanyEmail is required'),
		Notes: Yup.string().required('Notes is required'),
		Avatar: Yup.mixed().notRequired(),
		ImgUrl: Yup.string().notRequired()
	});

	function onSubmit(fields, { setStatus, setSubmitting }) {
		console.log('from submit', fields);
		setStatus();
		if (id === -1) {
			createProduct(fields, setSubmitting);
		} else {
			console.log('from submit', fields['Active']);
			updateProduct(id, fields, setSubmitting);
		}
	}

	const photoUpload = (e) => {
		e.preventDefault();
		const reader = new FileReader();
		const file = e.target.files[0];
		console.log(file);
		reader.onloadend = () => {
			setProduct({
				...product,
				ImgUrl: reader.result
			});
		};
		reader.readAsDataURL(file);
	};

	function createProduct(fields, setSubmitting) {
		let formdata = new FormData();
		Object.keys(fields).forEach((key) => {
			console.log(key, fields[key]);
			formdata.append(key, fields[key]);
		});
		productService
			.create(formdata, true, false)
			.then(() => {
				alertService.success('Product added successfully', {
					keepAfterRouteChange: true
				});
				onSave();
			})
			.catch((error) => {
				setSubmitting(false);
				alertService.error(error);
			});
	}

	function updateProduct(id, fields, setSubmitting) {
		let formdata = new FormData();
		console.log('product active', product.Active);
		Object.keys(product).forEach((key) => {
			formdata.append(key, product[key]);
		});

		productService
			.update(id, formdata, true)
			.then(() => {
				alertService.success('Product updated successfully', {
					keepAfterRouteChange: true
				});
				onSave();
			})
			.catch((error) => {
				setSubmitting(false);
				alertService.error(error);
			});
	}

	return (
		<Modal open={open}>
			<Header as="h2">{isAddMode(id) ? 'Add Product' : 'Edit Product'}</Header>
			<Formik
				initialValues={initialState}
				validationSchema={validationSchema}
				validator={() => ({})}
				onSubmit={onSubmit}
			>
				{({ errors, touched, isSubmitting, setFieldValue }) => {
					useEffect(
						() => {
							console.log(`id ${id}`);
							// if (id !== Id) {
							if (id !== -1 && open) {
								async function fetchAgent() {
									setLoading(true);
									const { data: prodObj } = await productService.getById(id);
									console.log(prodObj);
									setProduct(prodObj);
									const fields = [
										'ProductName',
										'ProductDescription',
										'Location',
										'StartDate',
										'EndDate',
										'Expiry',
										'Active',
										'DeActivate',
										'CompanyName',
										'CompanyContact',
										'CompanyAddressLine1',
										'CompanyAddressLine2',
										'CompanyPostCode',
										'CompanyLandLine',
										'CompanyMobile',
										'CompanyEmail',
										'Notes',
										'Avatar',
										'ImgUrl',
										'imagePreviewUrl'
									];
									fields.forEach((field) => {
										console.log(field, prodObj[field]);
										setFieldValue(field, prodObj[field] || '', true);
									});
									setLoading(false);
								}
								fetchAgent();
							}
							return () => {
								isVisible.current = false;
							};
							//}
						},
						[ open ]
					);

					return (
						<Form encType="multipart/form-data" style={{ padding: '15px' }}>
							<Grid stackable>
								<Grid.Row>
									<Grid.Column width={8}>
										<div className="form-group__col">
											<label>Product Name</label>
											<Input
												placeholder="ProductName"
												value={product.ProductName}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('ProductName', data.value);
													setProduct({
														...product,
														ProductName: data.value
													});
												}}
												className={'form-control' + (errors.ProductName ? ' is-invalid' : '')}
											/>
											<ErrorMessage name="ProductName" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>Product Description</label>
											<Input
												name="ProductDescription"
												placeholder="Product Description"
												value={product.ProductDescription}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('ProductDescription', data.value);
													setProduct({
														...product,
														ProductDescription: data.value
													});
												}}
												className={
													'form-control' + (errors.ProductDescription ? ' is-invalid' : '')
												}
											/>
											<ErrorMessage name="ProductDescription" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>Location</label>
											<Input
												name="Location"
												placeholder="Location"
												value={product.Location}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('Location', data.value);
													setProduct({
														...product,
														Location: data.value
													});
												}}
												className={'form-control' + (errors.Location ? ' is-invalid' : '')}
											/>
											<ErrorMessage name="Location" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>Start Time</label>
											<FlexRow>
												<DatePicker
													name="StartDate"
													ref={datePickerRef}
													selected={
														product.StartDate ? moment(product.StartDate).toDate() : ''
													}
													// //onSelect={handleDateSelect} //when day is clicked
													onChange={(e, data) => {
														console.log(e);
														setFieldValue('StartDate', e);
														setProduct({
															...product,
															StartDate: e
														});
													}}
													customInput={
														<Input
															style={{ width: '95%' }}
															className={
																'form-control' + (errors.StartDate ? ' is-invalid' : '')
															}
														/>
													}
												/>
												<Icon
													name="calendar"
													className="calendar__Icon"
													onClick={() => {
														datePickerRef.current.setOpen(true);
													}}
												/>
											</FlexRow>
										</div>
										<div className="form-group__col">
											<label>End Time</label>
											<FlexRow>
												<DatePicker
													name="EndDate"
													ref={endDatePickerRef}
													selected={product.EndDate ? moment(product.EndDate).toDate() : ''}
													// //onSelect={handleDateSelect} //when day is clicked
													onChange={(e, data) => {
														console.log(e);
														setFieldValue('EndDate', e);
														setProduct({
															...product,
															EndDate: e
														});
													}}
													customInput={
														<Input
															style={{ width: '95%' }}
															className={
																'form-control' + (errors.EndDate ? ' is-invalid' : '')
															}
														/>
													}
												/>
												<Icon
													name="calendar"
													className="calendar__Icon"
													onClick={() => {
														endDatePickerRef.current.setOpen(true);
													}}
												/>
											</FlexRow>
										</div>
										<div className="form-group__col">
											<label>Expiry</label>
											<FlexRow>
												<DatePicker
													name="Expiry"
													ref={expiryPickerRef}
													selected={product.Expiry ? moment(product.Expiry).toDate() : ''}
													// //onSelect={handleDateSelect} //when day is clicked
													onChange={(e, data) => {
														console.log(e);
														setFieldValue('Expiry', e);
														setProduct({
															...product,
															Expiry: e
														});
													}}
													customInput={
														<Input
															style={{ width: '95%' }}
															className={
																'form-control' + (errors.Expiry ? ' is-invalid' : '')
															}
														/>
													}
												/>
												<Icon
													name="calendar"
													className="calendar__Icon"
													onClick={() => {
														expiryPickerRef.current.setOpen(true);
													}}
												/>
											</FlexRow>
										</div>
										<div className="form-group__col">
											<label>Company Name</label>
											<Input
												name="CompanyName"
												placeholder="Company Name"
												value={product.CompanyName}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('CompanyName', data.value);
													setProduct({
														...product,
														CompanyName: data.value
													});
												}}
												className={'form-control' + (errors.CompanyName ? ' is-invalid' : '')}
											/>
											<ErrorMessage name="CompanyName" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>Company Contact</label>
											<Input
												name="CompanyContact"
												placeholder="CompanyContact"
												value={product.CompanyContact}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('CompanyContact', data.value);
													setProduct({
														...product,
														CompanyContact: data.value
													});
												}}
												className={
													'form-control' + (errors.CompanyContact ? ' is-invalid' : '')
												}
											/>
											<ErrorMessage name="City" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>Company Address Line1</label>
											<Input
												name="CompanyAddressLine1"
												placeholder="CompanyAddressLine1"
												value={product.CompanyAddressLine1}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('CompanyAddressLine1', data.value);
													setProduct({
														...product,
														CompanyAddressLine1: data.value
													});
												}}
												className={
													'form-control' + (errors.CompanyAddressLine1 ? ' is-invalid' : '')
												}
											/>
											<ErrorMessage name="CompanyAddressLine1" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>Company Address Line2</label>
											<Input
												name="CompanyAddressLine2"
												placeholder="Company Address Line2"
												value={product.CompanyAddressLine2}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('CompanyAddressLine2', data.value);
													setProduct({
														...product,
														CompanyAddressLine2: data.value
													});
												}}
												className={
													'form-control' + (errors.CompanyAddressLine2 ? ' is-invalid' : '')
												}
											/>
											<ErrorMessage name="CompanyAddressLine2" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>Company PostCode</label>
											<Input
												name="CompanyPostCode"
												placeholder="CompanyPostCode"
												value={product.CompanyPostCode}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('CompanyPostCode', data.value);
													setProduct({
														...product,
														CompanyPostCode: data.value
													});
												}}
												className={
													'form-control' + (errors.CompanyPostCode ? ' is-invalid' : '')
												}
											/>
											<ErrorMessage name="CompanyPostCode" className="invalid-feedback" />
										</div>
									</Grid.Column>
									<Grid.Column width={8}>
										<div className="form-group__col">
											<label>Company LandLine</label>
											<Input
												name="CompanyLandLine"
												placeholder="Company LandLine"
												value={product.CompanyLandLine}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('CompanyLandLine', data.value);
													setProduct({
														...product,
														CompanyLandLine: data.value
													});
												}}
												className={
													'form-control' + (errors.CompanyLandLine ? ' is-invalid' : '')
												}
											/>
											<ErrorMessage name="CompanyLandLine" className="invalid-feedback" />
										</div>

										<div className="form-group__col">
											<label>Company Mobile</label>
											<Input
												name="CompanyMobile"
												placeholder="Company Mobile"
												value={product.CompanyMobile}
												onChange={(e, data) => {
													console.log(data);
													setFieldValue('CompanyMobile', data.value);
													setProduct({
														...product,
														CompanyMobile: data.value
													});
												}}
												className={'form-control' + (errors.CompanyMobile ? ' is-invalid' : '')}
											/>
											<ErrorMessage name="CompanyMobile" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>CompanyEmail</label>
											<Input
												name="CompanyEmail"
												placeholder="Company Email"
												value={product.CompanyEmail}
												onChange={(e, data) => {
													setFieldValue('CompanyEmail', data.value);
													setProduct({
														...product,
														CompanyEmail: data.value
													});
												}}
												className={'form-control' + (errors.CompanyEmail ? ' is-invalid' : '')}
											/>
											<ErrorMessage name="CompanyEmail" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>Notes</label>
											<TextArea
												name="Notes"
												placeholder="Notes"
												value={product.Notes}
												onChange={(e, data) => {
													setFieldValue('Notes', data.value);
													setProduct({
														...product,
														Notes: data.value
													});
												}}
												className={'form-control' + (errors.Notes ? ' is-invalid' : '')}
											/>
											<ErrorMessage name="Notes" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>Active</label>
											<Checkbox
												name="Active"
												placeholder="Active"
												checked={product.Active}
												onChange={(e, data) => {
													console.log(data.checked);
													setFieldValue('Active', data.checked);
													setProduct({
														...product,
														Active: data.checked
													});
												}}
												className={'form-control' + (errors.Active ? ' is-invalid' : '')}
											/>
											<ErrorMessage name="Active" className="invalid-feedback" />
										</div>
										<div className="form-group__col">
											<label>DeActivate</label>
											<Checkbox
												name="DeActivate"
												placeholder="DeActivate"
												checked={product.DeActivate}
												onChange={(e, data) => {
													setFieldValue('DeActivate', data.checked);
													setProduct({
														...product,
														DeActivate: data.checked
													});
												}}
												className={'form-control' + (errors.DeActivate ? ' is-invalid' : '')}
											/>
											<ErrorMessage name="DeActivate" className="invalid-feedback" />
										</div>
										<div>
											<ImgUpload
												onChange={(e) => {
													setFieldValue('Avatar', e.currentTarget.files[0]);
													photoUpload(e);
												}}
												src={product.ImgUrl}
											/>
										</div>
									</Grid.Column>
								</Grid.Row>
							</Grid>
							<Segment floated="right" className="form-group model-actions">
								<Button
									type="submit"
									disabled={isSubmitting}
									loading={isSubmitting}
									className="btn basicStyle"
									icon
								>
									{id === -1 ? (
										<React.Fragment>
											<Icon name="plus" />
											Add
										</React.Fragment>
									) : (
										<React.Fragment>
											<Icon name="save" /> Save
										</React.Fragment>
									)}
								</Button>
								<Button
									onClick={(e) => {
										e.preventDefault();
										setProduct(initialState);
										onClose();
									}}
									className="btn basicStyle"
								>
									Cancel
								</Button>
							</Segment>
							{loading ? <Loading /> : ''}
						</Form>
					);
				}}
			</Formik>
		</Modal>
	);
}

export { AddEdit };
