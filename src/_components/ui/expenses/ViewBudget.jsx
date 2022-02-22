import React from 'react';
import { Segment } from 'semantic-ui-react';

const ViewBudget = (props) => {
    return (
        <div>
            <span><b>Total</b></span>
            <p>£{props.budget}</p>
        </div>
    );
};

export default ViewBudget;
