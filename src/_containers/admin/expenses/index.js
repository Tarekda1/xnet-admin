import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment, List } from 'semantic-ui-react';
import { AddExpenseForm, Budget, ExpenseList, ExpenseTotal, RemainingBudget } from '@/_components'

const Expenses = ({ match }) => {
	return (
		<Segment basic>
			<h1 className='mt-3'>My Budget Planner</h1>
			<List divided horizontal size={'big'}>
				<List.Item>
					<List.Content>
						<Budget />
					</List.Content>
				</List.Item>
				<List.Item>
					<List.Content>
						<RemainingBudget />
					</List.Content>
				</List.Item>
				<List.Item>
					<List.Content>
						<ExpenseTotal />
					</List.Content>
				</List.Item>
			</List>
			<h3 className='mt-3'>Expenses</h3>
			<div className='row '>
				<div className='col-sm'>
					<ExpenseList />
				</div>
			</div>
			<h3 className='mt-3'>Add Expense</h3>
			<div className='row mt-3'>
				<div className='col-sm'>
					<AddExpenseForm />
				</div>
			</div>
		</Segment>
	);
}

export default Expenses;
