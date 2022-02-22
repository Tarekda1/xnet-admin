import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, Form, Container, Segment } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';

export const AddExpenseForm = () => {
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [cost, setCost] = useState('');

    const onSubmit = (event) => {
        event.preventDefault();
        const expense = {
            id: uuidv4(),
            name,
            cost: parseInt(cost),
        };

        dispatch({
            type: 'ADD_EXPENSE',
            payload: expense,
        });

        setName('');
        setCost('');
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Field width={'3'}>
                <label for='name'>Name</label>
                <input
                    required='required'
                    type='text'
                    class='form-control'
                    id='name'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </Form.Field>
            <Form.Field width={'3'}>
                <label for='cost'>Cost</label>
                <input
                    required='required'
                    type='number'
                    class='form-control'
                    id='cost'
                    value={cost}
                    onChange={(event) => setCost(event.target.value)}
                />
            </Form.Field>
            <Button type='submit' class='btn btn-primary'>
                Save
            </Button>
        </Form>
    );
};

export default AddExpenseForm;
