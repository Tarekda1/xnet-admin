import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService, alertService } from '@/services';
import { Loading } from '@/components';
import { Segment, Table, Button, Icon, Confirm, Checkbox } from 'semantic-ui-react';
import { AddEdit } from './AddEdit';
import './List.less';

function List({ match }) {
	const { path } = match;
	const [ products, setProducts ] = useState([]);
	const [ loading, setloading ] = useState(true);
	const isVisibleRef = useRef(true);
	const [ selectedProductId, setSelectedProductId ] = useState(-1);
	const [ showModal, setshowModal ] = useState(false);
	const [ openDelete, setOpenDelete ] = useState(false);
	const [ selectedIdForDelete, setSelectedIdForDelete ] = useState(-1);

	async function fetchProducts() {
		const remoteProducts = await productService.getAll();
		console.log(remoteProducts.data);
		if (isVisibleRef.current) {
			setProducts(remoteProducts.data || []);
			setloading(false);
		}
	}

	async function fetchProductById() {
		try {
			const { data: updatedProduct } = await productService.getById(selectedProductId);
			console.log(updatedProduct);
			if (updatedProduct) {
				const tempProducts = [ ...products ];
				const index = tempProducts.findIndex((prod) => prod.id === updatedProduct.id);
				tempProducts[index] = updatedProduct;
				setProducts(tempProducts);
			}
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		fetchProducts();
		return () => {
			isVisibleRef.current = false;
		};
	}, []);

	function deleteProduct() {
		//show confirmation before delete
		// setOpenDelete(false);
		// setUsers(
		// 	users.map((x) => {
		// 		if (x.id === selectedIdForDelete) {
		// 			x.isDeleting = true;
		// 		}
		// 		return x;
		// 	})
		// );
		// accountService.delete(selectedIdForDelete).then((response) => {
		// 	setUsers((users) => users.filter((x) => x.id !== selectedIdForDelete));
		// });
	}

	return (
		<Segment>
			<Segment.Group className="header__controls" horizontal>
				<h1 className="page__title">List of Products</h1>
				<Button
					icon
					className="btn basicStyle"
					onClick={(e) => {
						setSelectedProductId((prev) => -1);
						setshowModal(true);
					}}
				>
					<Icon name="plus" /> Add Product
				</Button>
			</Segment.Group>
			{loading ? (
				<Loading />
			) : (
				<Table className="table table-striped users">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell style={{ width: '10%' }}>Product ID</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '10%' }}>Product Name</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '20%' }}>Product Description</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '10%' }}>Expiry</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '10%' }}>Location</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '20%' }}>Date Created</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '20%' }}>Notes</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '10%' }}>Active/Inactive</Table.HeaderCell>
							<Table.HeaderCell style={{ width: '10%' }}>DeActivate</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{products && products.length > 0 ? (
							products.map(
								({
									id,
									ProductName,
									ProductDescription,
									Expiry,
									Location,
									created_at: CreatedAt,
									Notes,
									Active,
									DeActivate,
									isDeleting
								}) => (
									<Table.Row className="users__row" key={id}>
										<Table.Cell>{id} </Table.Cell>
										<Table.Cell>{ProductName}</Table.Cell>
										<Table.Cell>{ProductDescription || "N/A'"}</Table.Cell>
										<Table.Cell>{Expiry}</Table.Cell>
										<Table.Cell>{Location}</Table.Cell>
										<Table.Cell>{CreatedAt}</Table.Cell>
										<Table.Cell>{Notes}</Table.Cell>
										<Table.Cell>
											<Checkbox label="" checked={Active} />
										</Table.Cell>
										<Table.Cell>
											<Checkbox label="" checked={DeActivate} />
										</Table.Cell>
										<Table.Cell tyle={{ whiteSpace: 'nowrap' }}>
											<div style={{ display: 'flex', flexDirection: 'row' }}>
												<Button
													icon
													className="basicStyle"
													onClick={() => {
														setSelectedProductId(id);
														setTimeout(() => {
															setshowModal(true);
														}, 100);
													}}
												>
													<Icon name="edit" />
												</Button>
												<Button
													onClick={() => {
														setSelectedIdForDelete(id);
														setOpenDelete(true);
													}}
													className="basicStyle users__row-delete"
													icon
													loading={isDeleting}
													disabled={isDeleting}
												>
													<Icon name="trash" />
												</Button>
											</div>
										</Table.Cell>
									</Table.Row>
								)
							)
						) : (
							<div>
								no products found <br />
							</div>
						)}
						{!products && (
							<Table.Row>
								<td colSpan="4" className="text-center">
									<span className="spinner-border spinner-border-lg align-center" />
								</td>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			)}
			<AddEdit
				id={selectedProductId}
				onSave={() => {
					setshowModal(false);
					console.log(`product id ${selectedProductId}`);
					if (selectedProductId === -1) {
						fetchProducts();
					} else {
						//update user data
						fetchProductById();
					}
				}}
				open={showModal}
				onClose={() => {
					setSelectedProductId(-1);
					setshowModal(false);
				}}
			/>
			<Confirm open={openDelete} onCancel={() => setOpenDelete(false)} onConfirm={deleteProduct} />
		</Segment>
	);
}

export { List };
