import React, { useEffect, useReducer } from 'react';
import { validate } from '../../utils/validators';
import './input.scss'

const inputReducer = (state, action) => {

    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH': {

            return {
                ...state,
                isTouched: true
            }
        }
        default:
            return state;
    }
};

const Input = ({
    label = '',
    type = 'text',
    className = '',
    id = '',
    errorText = '',
    rows = "10",
    onInput = () => { },
    initialValue = "",
    initialValid = false,
    validators
}) => {

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: initialValue || "",
        isTouched: false,
        isValid: initialValid
    });

    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(id, value, isValid);

    }, [id, value, isValid, onInput]);

    const changeHandler = event => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: validators
        });
    };

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH',
        });
    };
    return (
        <>
            <div className="input-container">
                {
                    type === 'textarea' ?
                        <textarea
                            required="required"
                            type={type}
                            id={id}
                            className={className}
                            value={value}
                            onChange={changeHandler}
                            onBlur={touchHandler}
                            rows={rows}

                        />
                        : <input
                            required="required"
                            type={type}
                            id={id}
                            className={className}
                            value={value}
                            onChange={changeHandler}
                            onBlur={touchHandler}
                        />
                }
                <label>{label}</label>
                {!inputState.isValid && inputState.isTouched && <span className='error-text'>{errorText}</span>}
            </div>

        </>
    );
}

export default Input;