import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, Form, Container, Segment, Grid, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { UseAddExpense } from "../../../hooks";
import "./expenseform.less"

const FullWidthButton = styled(Button)`
    width:100%;
`

export const AddExpenseForm = () => {
    const { addExpense, error, loading } = UseAddExpense();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');

    var columnStyle = {
        padding: "0 !important"
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(cost);
        const expense = {
            name,
            description,
            value: parseInt(cost),
        };

        await addExpense(expense);

        dispatch({
            type: 'ADD_EXPENSE',
            payload: expense,
        });

        setName('');
        setCost('');
    };

    return (
        <div stackable basic textAlign='left' style={{ padding: '0 !important' }}>
            <Form onSubmit={onSubmit} widths={'equal'}>
                <Form.Field>
                    <label htmlFor='name'>Name</label>
                    <input
                        required='required'
                        type='text'
                        className="form__input"
                        id='name'
                        width={12}
                        fluid
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor='cost'>Cost</label>
                    <input
                        required='required'
                        className="form__input"
                        id='cost'
                        fluid
                        value={cost}
                        onChange={(event) => setCost(event.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor='description'>Description</label>
                    <input
                        required='required'
                        className="form__input"
                        id='description'
                        fluid
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </Form.Field>
                <FullWidthButton loading={loading} type='submit' className='btn basicStyle'>
                    <Icon name="plus" />
                    Save
                </FullWidthButton>
            </Form>
        </div >
    );
};

export default AddExpenseForm;
